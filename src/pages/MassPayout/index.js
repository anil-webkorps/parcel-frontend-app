import React from "react";

import Authenticated from "components/hoc/Authenticated";
import { useSelector } from "react-redux";
import { EthersAdapter } from "contract-proxy-kit";
import { ethers } from "ethers";
import Button from "components/common/Button";
import { useActiveWeb3React, useContract } from "hooks";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import ERC20ABI from "constants/abis/ERC20.json";
import MultiSendABI from "constants/abis/MultiSend.json";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
// Steps:
// 1. Take 3 addresses for mass payout
// 2. Encode 3 transfer functions, one for each address
// 3. Call execTransactions

//////////// HEX OPERATIONS
export function joinHexData(hexData) {
  return `0x${hexData
    .map((hex) => {
      const stripped = hex.replace(/^0x/, "");
      return stripped.length % 2 === 0 ? stripped : "0" + stripped;
    })
    .join("")}`;
}

export function getHexDataLength(hexData) {
  return Math.ceil(
    (hexData.startsWith("0x") ? hexData.length - 2 : hexData.length) / 2
  );
}

export function toHex(v) {
  return `0x${Number(v.toString()).toString(16)}`;
}
////////////

//////////// HELPERS
export const defaultTxOperation = 0;
export const defaultTxValue = 0;
export const defaultTxData = "0x";

export function standardizeTransaction(tx) {
  return {
    operation: tx.operation ? tx.operation : defaultTxOperation,
    to: tx.to,
    value: tx.value ? Number(tx.value.toString()) : defaultTxValue,
    data: tx.data ? tx.data : defaultTxData,
  };
}
////////////

const MULTI_SEND_ADDRESS = "0x8D29bE29923b68abfDD21e541b9374737B49cdAD";
const DAI_ADDRESS = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";

const ADDRESS_1 = "0xBc8e608893E1831afB80Eff86912C9d8bFA81143"; // 9
const ADDRESS_2 = "0xb723aa10623b036aA72fa2e8a4a0d5eF77DBB1B5"; // 10
const ADDRESS_3 = "0xEC3f0E56271746aB9a115788Ef7a4265E1089b03"; // 11

const ONE_DAI = "1000000000000000000";

const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS } = addresses;

const MassPayoutPage = () => {
  const { account, library } = useActiveWeb3React();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  // Contracts
  // const gnosisSafeMasterContract = useContract(
  //   GNOSIS_SAFE_ADDRESS,
  //   GnosisSafeABI,
  //   true
  // );

  // const proxyFactory = useContract(
  //   PROXY_FACTORY_ADDRESS,
  //   ProxyFactoryABI,
  //   true
  // );

  const proxyContract = useContract(ownerSafeAddress, GnosisSafeABI, true);

  const dai = useContract(DAI_ADDRESS, ERC20ABI, true);

  const multiSend = useContract(MULTI_SEND_ADDRESS, MultiSendABI);

  const encodeMultiSendCallData = (transactions, ethLibAdapter) => {
    // const multiSend = this.#multiSend || this.#ethLibAdapter.getContract(multiSendAbi)
    const standardizedTxs = transactions.map(standardizeTransaction);
    console.log({ standardizedTxs });
    // const ethLibAdapter = this.#ethLibAdapter
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

  const handleMassPayout = async () => {
    if (account && library) {
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: library.getSigner(account),
      });
      console.log({ add: dai.address });

      const transactions = [
        {
          operation: 0, // CALL
          to: dai.address,
          value: 0,
          data: dai.interface.encodeFunctionData("transfer", [
            ADDRESS_1,
            ONE_DAI,
          ]),
        },
        {
          operation: 0, // CALL
          to: dai.address,
          value: 0,
          data: dai.interface.encodeFunctionData("transfer", [
            ADDRESS_2,
            ONE_DAI,
          ]),
        },
        {
          operation: 0, // CALL
          to: dai.address,
          value: 0,
          data: dai.interface.encodeFunctionData("transfer", [
            ADDRESS_3,
            ONE_DAI,
          ]),
        },
      ];

      const dataHash = encodeMultiSendCallData(transactions, ethLibAdapter);
      console.log({ dataHash });
      console.log({ proxyContract });

      // Set parameters of execTransaction()
      const valueWei = 0;
      const data = dataHash;
      // const data = dai.interface.encodeFunctionData("transfer", [
      //   ADDRESS_1,
      //   ONE_DAI,
      // ]); // Encode data of token transfer()
      console.log("Data payload:", data);
      // const operation = 0; // CALL
      const operation = 1; // DELEGATECALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = "0x0000000000000000000000000000000000000000"; // ETH
      const txGasEstimate = 0;
      const baseGasEstimate = 0;
      const executor = "0x0000000000000000000000000000000000000000";
      // const executor = account;
      // const signature = "0";

      // (r, s, v) where v is 1 means this signature is approved by the address encoded in value r
      // "Hashes are automatically approved by the sender of the message"
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: account }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      console.log({ autoApprovedSignature });

      // console.log({ proxyContract: await proxyContract.NAME() });

      const tx = await proxyContract.execTransaction(
        MULTI_SEND_ADDRESS,
        valueWei,
        data,
        operation,
        txGasEstimate,
        baseGasEstimate,
        gasPrice,
        gasToken,
        executor,
        autoApprovedSignature,
        { gasLimit: "300000", gasPrice: "10000000000" }
      );

      const result = await tx.wait();

      console.log({ result });
    }
  };
  return (
    <Authenticated>
      <h3 className="text-center my-4">Mass Payout</h3>
      <p className="text-center my-4">{ADDRESS_1}</p>
      <p className="text-center my-4">{ADDRESS_2}</p>
      <p className="text-center my-4">{ADDRESS_3}</p>
      <Button className="text-center my-4 mx-auto" onClick={handleMassPayout}>
        Send 1 DAI to each address
      </Button>
    </Authenticated>
  );
};

export default MassPayoutPage;
