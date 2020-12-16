import { injected } from "connectors";
import MetamaskIcon from "assets/icons/icon-metamask.svg";
export const NetworkContextName = "NETWORK";

export const supportedWallets = [
  {
    name: "MetaMask",
    connector: injected,
    icon: MetamaskIcon,
    description: "Injected web3 provider.",
    id: 1,
  },
  // Add other wallets and connectors here
];

export const DEFAULT_GAS_PRICE = "10000000000"; // 100 gwei
export const ONE_GWEI = "100000000";

export const MESSAGE_TO_SIGN = "I hereby sign and authorize Parcel.";

export const tokens = {
  DAI: "DAI",
  USDC: "USDC",
  USDT: "USDT",
  ETH: "ETH",
};
