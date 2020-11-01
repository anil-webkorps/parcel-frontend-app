import React, { useCallback } from "react";

import { useActiveWeb3React, useContract } from "hooks";
import Button from "components/common/Button";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";

const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS } = addresses;

export default function CreateSafeButton() {
  const { account } = useActiveWeb3React();
  const gnosisSafeMasterContract = useContract(
    GNOSIS_SAFE_ADDRESS,
    GnosisSafeABI,
    true
  );

  const proxyFactory = useContract(
    PROXY_FACTORY_ADDRESS,
    ProxyFactoryABI,
    true
  );

  const createSafe = useCallback(async () => {
    if (gnosisSafeMasterContract && proxyFactory && account) {
      console.log({ gnosisSafeMasterContract });

      /// @dev Setup function sets initial storage of contract.
      /// @param _owners List of Safe owners.
      /// @param _threshold Number of required confirmations for a Safe transaction.
      /// @param to Contract address for optional delegate call.
      /// @param data Data payload for optional delegate call.
      /// @param fallbackHandler Handler for fallback calls to this contract
      /// @param paymentToken Token that should be used for the payment (0 is ETH)
      /// @param payment Value that should be paid
      /// @param paymentReceiver Adddress that should receive the payment (or 0 if tx.origin)
      const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
        "setup",
        [
          [
            "0x9ef14db2e143a0061577ab69538c5fd2a269f973",
            "0xf1f1762862aa42d9ddf90b71686762402b6ed8ae",
          ],
          1,
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          0,
          "0x0000000000000000000000000000000000000000",
        ]
      );

      // Create Proxy
      const estimateGas = await proxyFactory.estimateGas.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData
      );

      const tx = await proxyFactory.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData,
        { gasLimit: estimateGas }
      );

      await tx.wait();
      console.log("tx success");
    }
  }, [gnosisSafeMasterContract, proxyFactory, account]);
  return (
    <div>
      <Button onClick={createSafe}>Create Gnosis Safe</Button>
    </div>
  );
}
