import React, { useCallback } from "react";

import { useActiveWeb3React } from "hooks";
import Button from "components/common/Button";

export default function CreateSafeButton({ setSign }) {
  // const setSign = useLocalStorage("SIGNATURE")[1];
  const { library, account } = useActiveWeb3React();

  const signTerms = useCallback(async () => {
    if (!!library && !!account) {
      try {
        await library
          .getSigner(account)
          .signMessage(`sign your ${account} to create encryption key`)
          .then((signature) => setSign && setSign(signature));
      } catch (error) {
        console.error("Transaction Failed");
      }
    }
  }, [library, account, setSign]);

  return (
    <div>
      <Button onClick={signTerms}>Sign and Accept Terms</Button>
    </div>
  );
}
