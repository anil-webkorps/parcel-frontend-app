import React, { useCallback } from "react";

import { useActiveWeb3React } from "hooks";
import Button from "components/common/Button";

export default function CreateSafeButton() {
  const { library, account } = useActiveWeb3React();

  const signTerms = useCallback(async () => {
    // setIsSubmitting(true);

    // if (ensName.length < 5) {
    //   setInvalidState(true);
    //   setError('Name must be at least 5 characters');
    //   setIsSubmitting(false);
    //   return;
    // } else if (ensName.length > 20) {
    //   setInvalidState(true);
    //   setError('Name must be less than 20 characters');
    //   setIsSubmitting(false);
    //   return;
    // }

    // const nameHash = keccak256(toUtf8Bytes(ensName));
    // const ensFullDomainHash = namehash.hash(ensName + '.parcelid.eth');

    if (!!library && !!account) {
      try {
        await library
          .getSigner(account)
          .signMessage(`sign your ${account} to create encryption key`)
          .then((signature) => localStorage.setItem("SIGNATURE", signature));

        // const tx = await parcelFactoryContract.register(
        //   PARCEL_ID_HASH,
        //   nameHash,
        //   ensFullDomainHash,
        //   ensName + '.parcelid.eth'
        // );

        // toast('ID Submitted');
        // await tx.wait();

        // let parcelOrgAddress = await parcelFactoryContract.registered(
        //   account
        // );

        // localStorage.setItem('PARCEL_WALLET_ADDRESS', parcelOrgAddress);
      } catch (error) {
        console.error("Transaction Failed");
      }
    }
  }, [library, account]);

  return (
    <div>
      <Button onClick={signTerms}>Sign and Accept Terms</Button>
    </div>
  );
}
