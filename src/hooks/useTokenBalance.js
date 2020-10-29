import useContract from "./useContract";
import BalanceABI from "constants/abis/Balance.json";
import useActiveWeb3React from "./useActiveWeb3React";
import { useEffect, useState, useCallback } from "react";

const useTokenBalance = (address, dependencies = null) => {
  const contract = useContract(address, BalanceABI);
  const { account, chainId } = useActiveWeb3React();
  const [tokenBalance, setTokenBalance] = useState(null);

  const getBalance = useCallback(async () => {
    if (contract && account) {
      try {
        const tokenBalance = await contract.balanceOf(account);
        const decimals = await contract.decimals();

        const balance = tokenBalance / 10 ** decimals;
        const balanceNum = parseFloat(balance).toFixed(2);
        setTokenBalance(balanceNum);
      } catch (err) {
        console.error(err);
      }
    }
  }, [account, contract]);
  useEffect(() => {
    getBalance();
  }, [account, chainId, getBalance, dependencies]);

  return tokenBalance;
};

export default useTokenBalance;
