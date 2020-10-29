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

export const cryptoCompareEndpoint =
  "https://min-api.cryptocompare.com/data/price?fsym=IND&tsyms=USD";

export const ethGasStationEndpoint =
  "https://ethgasstation.info/api/ethgasAPI.json?";

export const DEFAULT_GAS_PRICE = "100000000000"; // 100 gwei
