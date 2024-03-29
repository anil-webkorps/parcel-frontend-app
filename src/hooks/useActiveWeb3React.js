import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";

const useActiveWeb3React = () => {
  const context = useWeb3ReactCore();
  return context.active ? context : {};
};

export default useActiveWeb3React;
