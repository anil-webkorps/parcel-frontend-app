/*
 * useMassPayout hook
 * This abstracts away the mass payout functionality
 * the massPayout function takes an array of objects, `recievers` with the keys:
 * address, salaryToken("DAI"/"USDC" etc), salaryAmount(in ETH, "10"/"500" etc.)
 * [{address: String, salaryToken: String, salaryAmount: String}]
 */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BigNumber } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { addDays, format } from "date-fns";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";

import { useActiveWeb3React, useContract } from "hooks";
import {
  joinHexData,
  getHexDataLength,
  standardizeTransaction,
  getAmountInWei,
} from "utils/tx-helpers";
import addresses from "constants/addresses";
import { DEFAULT_GAS_PRICE, tokens } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ERC20ABI from "constants/abis/ERC20.json";
import MultiSendABI from "constants/abis/MultiSend.json";
import UniswapABI from "constants/abis/Uniswap.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getGasPrice } from "store/gas/actions";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectAverageGasPrice } from "store/gas/selectors";

const gasPriceKey = "gas";

const {
  DAI_ADDRESS,
  MULTISEND_ADDRESS,
  ZERO_ADDRESS,
  USDC_ADDRESS,
  UNISWAP_ROUTER_ADDRESS,
  WETH_ADDRESS,
} = addresses;

const tokenNameToAddress = {
  [tokens.DAI]: DAI_ADDRESS,
  [tokens.USDC]: USDC_ADDRESS,
  // add other tokens and addresses here
};

export default function useMassPayout() {
  const { account, library } = useActiveWeb3React();

  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [recievers, setRecievers] = useState();

  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });

  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());

  // contracts
  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);
  const dai = useContract(DAI_ADDRESS, ERC20ABI, true);
  const usdc = useContract(USDC_ADDRESS, ERC20ABI, true); // eslint-disable-line
  const multiSend = useContract(MULTISEND_ADDRESS, MultiSendABI);
  const uniswapRouter = useContract(UNISWAP_ROUTER_ADDRESS, UniswapABI);

  useEffect(() => {
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

  const encodeMultiSendCallData = (transactions, ethLibAdapter) => {
    const standardizedTxs = transactions.map(standardizeTransaction);

    return multiSend.interface.encodeFunctionData("multiSend", [
      joinHexData(
        standardizedTxs.map((tx) =>
          ethLibAdapter.abiEncodePacked(
            { type: "uint8", value: tx.operation },
            { type: "address", value: tx.to },
            { type: "uint256", value: tx.value },
            { type: "uint256", value: getHexDataLength(tx.data) },
            { type: "bytes", value: tx.data }
          )
        )
      ),
    ]);
  };

  // if the tokens are different, add two transactions:
  // 1. approve uniswap router to spend the token (eg DAI)
  // 2. swap the input token for the output token using uniswap
  const getUniswapTransactions = (tokenName, tokenAmount, toAddress) => {
    // TODO: come up with a better solution for max amount in
    // should calculate max amount needed for the swap from uniswap
    const amountIn = parseEther(String(Number.MAX_SAFE_INTEGER));

    const amountOut = getAmountInWei(tokenName, tokenAmount);
    const uniswapData = uniswapRouter.interface.encodeFunctionData(
      "swapTokensForExactTokens",
      [
        amountOut,
        amountIn,
        [DAI_ADDRESS, WETH_ADDRESS, USDC_ADDRESS],
        toAddress,
        format(addDays(Date.now(), 1), "t"),
      ]
    );

    return [
      {
        operation: 0, // CALL
        to: DAI_ADDRESS,
        value: 0,
        data: dai.interface.encodeFunctionData("approve", [
          UNISWAP_ROUTER_ADDRESS,
          amountIn,
        ]),
      },
      {
        operation: 0, // CALL
        to: UNISWAP_ROUTER_ADDRESS,
        value: 0,
        data: uniswapData,
      },
    ];
  };

  const massPayout = async (recievers) => {
    setRecievers(recievers);

    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });

      // If input and output tokens are different, swap using uniswap
      // If input and output tokens are same, simply call transfer
      const transactions = recievers.reduce(
        (tx, { address, salaryToken, salaryAmount }) => {
          if (salaryToken !== tokens.DAI) {
            // replace tokens.DAI with whatever input token is chosen
            tx.push(
              ...getUniswapTransactions(salaryToken, salaryAmount, address)
            );
            return tx;
          }

          tx.push({
            operation: 0, // CALL
            to: tokenNameToAddress[salaryToken],
            value: 0,
            data: dai.interface.encodeFunctionData("transfer", [
              address,
              BigNumber.from(salaryAmount).mul(
                BigNumber.from(String(10 ** 18))
              ),
            ]),
          });
          return tx;
        },
        []
      );

      const dataHash = encodeMultiSendCallData(transactions, ethLibAdapter);

      // Set parameters of execTransaction()
      const valueWei = 0;
      const data = dataHash;
      const operation = 1; // DELEGATECALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = ZERO_ADDRESS; // ETH
      const txGasEstimate = 0;
      const baseGasEstimate = 0;
      const executor = ZERO_ADDRESS;

      // (r, s, v) where v is 1 means this signature is approved by the address encoded in value r
      // For a single user, we auto generate the signature without prompting the user
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: account }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      try {
        setLoadingTx(true);
        setTxHash("");

        const gasLimit = await proxyContract.estimateGas.execTransaction(
          MULTISEND_ADDRESS,
          valueWei,
          data,
          operation,
          txGasEstimate,
          baseGasEstimate,
          gasPrice,
          gasToken,
          executor,
          autoApprovedSignature
        );

        const tx = await proxyContract.execTransaction(
          MULTISEND_ADDRESS,
          valueWei,
          data,
          operation,
          txGasEstimate,
          baseGasEstimate,
          gasPrice,
          gasToken,
          executor,
          autoApprovedSignature,
          {
            gasLimit: Math.floor(gasLimit.toNumber() * 2.75), // giving a little higher gas limit just in case
            gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
          }
        );
        setTxHash(tx.hash);
        setLoadingTx(false);

        await tx.wait();
      } catch (err) {
        setLoadingTx(false);
        console.error(err);
      }
    }
  };

  return { loadingTx, txHash, recievers, massPayout };
}
