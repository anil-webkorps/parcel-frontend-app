import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { utils } from "ethers";

import { MESSAGE_TO_SIGN } from "constants/index";
import { useLocalStorage, useActiveWeb3React } from "./index";

export default function useAuth() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { account } = useActiveWeb3React();

  const checkValidSignature = (sign, account) => {
    if (!sign) return false;
    const msgHash = utils.hashMessage(MESSAGE_TO_SIGN);
    const recoveredAddress = utils.recoverAddress(msgHash, sign);
    if (recoveredAddress === account) {
      return true;
    }
    return false;
  };

  const history = useHistory();
  useEffect(() => {
    // TODO: Redirect to login page if the account is undefined
    // account is loaded with a delay, so we can't directly redirect if account === undefined
    // Potential fix: Inside store, set account = "". Once account loads, overwrite it.
    // account = "" (loading) / "0x..." (success) / undefined (error, redirect to login)
    if (account) {
      const isAuthenticated = checkValidSignature(sign, account);
      if (!isAuthenticated) {
        history.push("/"); // login
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [history, sign, account]);

  return isAuthenticated;
}
