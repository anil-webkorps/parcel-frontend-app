import { useContext } from "react";
// import { useWeb3React as useWeb3ReactCore } from "@web3-react/core";
import { Web3ReactContext } from "context/Web3ReactContext";

const useActiveWeb3React = () => {
  // const context = useWeb3ReactCore();
  const context = useContext(Web3ReactContext);
  // console.log({ context });
  return context.active ? context : { onboard: context.onboard };
};

export default useActiveWeb3React;
