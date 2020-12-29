/*
 * useMassPayout hook
 * the massPayout function takes two params:
 * an array of objects, `recievers` with the keys:
 * address, salaryToken("DAI"/"USDC" etc), salaryAmount(in ETH, "10"/"500" etc.)
 * and the token to pay them from ("DAI"/"USDC" etc)
 * [{address: String, salaryToken: String, salaryAmount: String}]
 */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { BigNumber } from "@ethersproject/bignumber";
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
import { createMultisigTransaction, getSafeDetails } from "store/safe/actions";
import safeDetailsSaga from "store/safe/saga";
import safeDetailsReducer from "store/safe/reducer";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import {
  makeSelectNonce,
  makeSelectOwners,
  makeSelectThreshold,
} from "store/safe/selectors";
import { getConfigByTokenNames } from "utils/massPayout";

const gasPriceKey = "gas";
const safeDetailsKey = "safe";

const {
  DAI_ADDRESS,
  MULTISEND_ADDRESS,
  ZERO_ADDRESS,
  USDC_ADDRESS,
  USDT_ADDRESS,
  UNISWAP_ROUTER_ADDRESS,
  GNOSIS_SAFE_ADDRESS,
} = addresses;

export default function useMassPayout() {
  const { account, library } = useActiveWeb3React();

  const [loadingTx, setLoadingTx] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [recievers, setRecievers] = useState();

  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });
  useInjectReducer({ key: safeDetailsKey, reducer: safeDetailsReducer });

  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });
  useInjectSaga({ key: safeDetailsKey, saga: safeDetailsSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());
  const nonce = useSelector(makeSelectNonce());
  const safeOwners = useSelector(makeSelectOwners());
  const threshold = useSelector(makeSelectThreshold());

  // contracts
  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);
  // Contracts
  //eslint-disable-next-line
  const gnosisSafeMasterContract = useContract(
    GNOSIS_SAFE_ADDRESS,
    GnosisSafeABI
  );
  // const proxyContractRead = useContract(ownerSafeAddress, GnosisSafeABI, false);
  const [tokenFrom, setTokenFrom] = useState(tokens.DAI); // eslint-disable-line
  const dai = useContract(DAI_ADDRESS, ERC20ABI, true);
  // const erc20 = useContract(tokenNameToAddress[tokenFrom], ERC20ABI, true);
  const usdc = useContract(USDC_ADDRESS, ERC20ABI, true); // eslint-disable-line
  const usdt = useContract(USDT_ADDRESS, ERC20ABI, true); // eslint-disable-line
  const multiSend = useContract(MULTISEND_ADDRESS, MultiSendABI);
  const uniswapRouter = useContract(UNISWAP_ROUTER_ADDRESS, UniswapABI);

  useEffect(() => {
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

  useEffect(() => {
    if (ownerSafeAddress) {
      // get safe details
      dispatch(getSafeDetails(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

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

  let signTypedData = async function (account, typedData) {
    return new Promise(function (resolve, reject) {
      // const digest = TypedDataUtils.encodeDigest(typedData);
      try {
        const signer = library.getSigner(account);
        console.log({ typedData, signer, account });

        signer
          .getAddress()
          .then((address) =>
            library
              .send("eth_signTypedData_v3", [
                address,
                JSON.stringify({
                  domain: typedData.domain,
                  types: typedData.types,
                  message: typedData.message,
                  primaryType: "SafeTx",
                }),
              ])
              .then((signature) => {
                console.log({ signature });

                resolve(signature.replace("0x", ""));
              })
          )
          .catch(console.error);
        // signer
        //   ._signTypedData(typedData.domain, typedData.types, typedData.message)
        //   .then((signature) => {
        //     console.log({ signature });
        //     // resolve(signature);
        //     resolve(signature.replace("0x", ""));
        //   });
        // signer.signMessage(digest).then((signature) => {
        //   console.log({ signature });
        //   resolve(signature);
        // });
      } catch (err) {
        return reject(err);
      }
    });
  };

  const signTransaction = async (
    to = "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
    value = "0",
    data = "0xa9059cbb0000000000000000000000005222318905891ae154c3fa5437830caa86be54990000000000000000000000000000000000000000000000008ac7230489e80000",
    operation = 0,
    txGasEstimate = 25565,
    baseGasEstimate = 0,
    gasPrice = "0",
    txGasToken = "0x0000000000000000000000000000000000000000",
    refundReceiver = "0x0000000000000000000000000000000000000000",
    nonce = 3
  ) => {
    const domain = {
      verifyingContract: ownerSafeAddress,
    };

    const types = {
      EIP712Domain: [{ type: "address", name: "verifyingContract" }],
      SafeTx: [
        { type: "address", name: "to" },
        { type: "uint256", name: "value" },
        { type: "bytes", name: "data" },
        { type: "uint8", name: "operation" },
        { type: "uint256", name: "safeTxGas" },
        { type: "uint256", name: "baseGas" },
        { type: "uint256", name: "gasPrice" },
        { type: "address", name: "gasToken" },
        { type: "address", name: "refundReceiver" },
        { type: "uint256", name: "nonce" },
      ],
    };
    console.log({ nonce });

    const message = {
      to: to,
      value: value,
      data: data,
      operation: operation,
      safeTxGas: txGasEstimate,
      baseGas: baseGasEstimate,
      gasPrice: gasPrice,
      gasToken: txGasToken,
      refundReceiver: refundReceiver,
      nonce,
    };

    const typedData = {
      domain,
      types,
      message,
    };

    let signatureBytes = "0x";
    const signature = await signTypedData(account, typedData);
    // const signature =
    //   "a1301d30b4a75e24baf2c7a0965712ec26cd9e4411bd1f3263baaf72f4262ed7385c9b903527662a82b4a2d6517220100ff6d12a9de36adb1ac7e8042c4bd8231c";

    const contractTransactionHash = await proxyContract.getTransactionHash(
      to,
      value,
      data,
      operation,
      txGasEstimate,
      baseGasEstimate,
      gasPrice,
      txGasToken,
      refundReceiver,
      nonce
    );

    dispatch(
      createMultisigTransaction({
        safeAddress: ownerSafeAddress,
        to,
        value: String(value),
        data,
        operation,
        gasToken: txGasToken,
        safeTxGas: Number(txGasEstimate),
        baseGas: baseGasEstimate,
        gasPrice: String(gasPrice),
        refundReceiver,
        nonce,
        contractTransactionHash,
        sender: account,
        signature,
        origin: null,
      })
    );
    // confirmingAccounts.sort();
    // for (var i = 0; i < confirmingAccounts.length; i++) {
    //   signatureBytes += (
    //     await signTypedData(confirmingAccounts[i], typedData)
    //   ).replace("0x", "");
    // }
    return signatureBytes;
  };

  const getERC20ContractByName = (name) => {
    switch (name) {
      case tokens.DAI:
        return dai;
      case tokens.USDC:
        return usdc;
      case tokens.USDT:
        return usdt;
      default:
        return dai;
    }
  };

  // if the tokens are different, add two transactions:
  // 1. approve uniswap router to spend the token (eg DAI)
  // 2. swap the input token for the output token using uniswap
  const getUniswapTransactions = (
    tokenTo,
    tokenAmount,
    toAddress,
    tokenFrom
  ) => {
    // TODO: come up with a better solution for max amount in
    // should calculate max amount needed for the swap from uniswap
    const amountIn = parseEther(String(Number.MAX_SAFE_INTEGER));

    const amountOut = getAmountInWei(tokenTo, tokenAmount);

    const { functionName, path } = getConfigByTokenNames(tokenTo, tokenFrom);
    const erc20 = getERC20ContractByName(tokenFrom);
    if (!functionName || !path.length) return [];

    const uniswapData = uniswapRouter.interface.encodeFunctionData(
      functionName,
      [
        amountOut,
        amountIn,
        path,
        toAddress,
        format(addDays(Date.now(), 1), "t"),
      ]
    );

    return [
      {
        operation: 0, // CALL
        to: erc20.address,
        value: 0,
        data: erc20.interface.encodeFunctionData("approve", [
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

  const massPayout = async (recievers, tokenFrom) => {
    setRecievers(recievers);
    setTokenFrom(tokenFrom);

    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });

      const erc20 = getERC20ContractByName(tokenFrom);

      // If input and output tokens are different, swap using uniswap
      // If input and output tokens are same, simply call transfer
      const transactions = recievers.reduce(
        (tx, { address, salaryToken, salaryAmount }) => {
          if (salaryToken !== tokenFrom) {
            tx.push(
              ...getUniswapTransactions(
                salaryToken,
                salaryAmount,
                address,
                tokenFrom
              )
            );
            return tx;
          }

          const transferAmount = getAmountInWei(salaryToken, salaryAmount);
          tx.push({
            operation: 0, // CALL
            to: erc20.address,
            value: 0,
            data: erc20.interface.encodeFunctionData("transfer", [
              address,
              transferAmount,
            ]),
          });
          return tx;
        },
        []
      );

      const dataHash = encodeMultiSendCallData(transactions, ethLibAdapter);

      // Set parameters of execTransaction()
      const to = MULTISEND_ADDRESS;
      const valueWei = 0;
      const data = dataHash;
      const operation = 1; // DELEGATECALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = ZERO_ADDRESS; // ETH
      let txGasEstimate = 0;
      const baseGasEstimate = 0;
      const executor = ZERO_ADDRESS;

      // (r, s, v) where v is 1 means this signature is approved by the address encoded in value r
      // For a single user, we auto generate the signature without prompting the user
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: account }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      // if threshold > 1 and confirmations < threshold
      if (threshold > 1) {
        console.log({ threshold, safeOwners, nonce });

        // Estimate safe transaction (need to be called with from set to the safe address)
        // let estimateData = gnosisSafeMasterContract.interface.encodeFunctionData(
        //   "requiredTxGas",
        //   [to, valueWei, data, operation]
        // );

        // try {
        //   let estimateResponse = await library.call({
        //     to: ownerSafeAddress,
        //     from: ownerSafeAddress,
        //     data: estimateData,
        //     gasPrice: 0,
        //   });
        //   console.log({ estimateResponse });

        //   // Add 10k else we will fail in case of nested calls
        //   txGasEstimate = txGasEstimate.toNumber() + 10000;
        //   console.log("Tx Gas estimate: " + txGasEstimate);
        // } catch (e) {
        //   console.log("Could not estimate ", { e });
        // }

        let gasLimit = "1000000";

        signTransaction(
          to,
          valueWei,
          data,
          operation,
          gasLimit,
          baseGasEstimate,
          gasPrice,
          gasToken,
          ZERO_ADDRESS,
          // nonce
          4
        );

        return;
      }

      try {
        setLoadingTx(true);
        setTxHash("");

        const gasLimit = await proxyContract.estimateGas.execTransaction(
          to,
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
          to,
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
            gasLimit: Math.floor(gasLimit.toNumber() * 10), // giving a little higher gas limit just in case
            // TODO: revisit gas limit estimation issue
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
