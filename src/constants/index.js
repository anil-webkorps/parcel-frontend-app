import { injected } from "connectors";
import MetamaskIcon from "assets/icons/icon-metamask.svg";
// import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import USDTIcon from "assets/icons/tokens/USDT-icon.png";

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

export const getDefaultIconIfPossible = (tokenSymbol) => {
  switch (tokenSymbol) {
    case tokens.DAI:
      return DAIIcon;
    case tokens.USDC:
      return USDCIcon;
    case tokens.USDT:
      return USDTIcon;
    default:
      return null;
  }
};

export const defaultTokenDetails = [
  // {
  //   id: 0,
  //   name: DEFAULT_TOKENS.ETH,
  //   icon: ETHIcon,
  //   balance: "0.00",
  //   usd: "0.00",
  // },
  {
    id: 1,
    name: tokens.DAI,
    icon: DAIIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 2,
    name: tokens.USDC,
    icon: USDCIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 3,
    name: tokens.USDC,
    icon: USDTIcon,
    balance: "0.00",
    usd: "0.00",
  },
];
