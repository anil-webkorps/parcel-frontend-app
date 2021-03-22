import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";

import MetamaskIcon from "assets/icons/wallets/icon-metamask.svg";
import WalletConnectIcon from "assets/icons/wallets/icon-wallet-connect.svg";
import FortmaticIcon from "assets/icons/wallets/icon-fortmatic.svg";
import LedgerIcon from "assets/icons/wallets/icon-ledger.svg";
import TrezorIcon from "assets/icons/wallets/icon-trezor.svg";
import { networkId } from "constants/networks";

const POLLING_INTERVAL = 12000;
const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
  4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_TOKEN}`,
};

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1,
  pollingInterval: POLLING_INTERVAL,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { [networkId]: RPC_URLS[networkId] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

// export const walletlink = new WalletLinkConnector({
//   url: RPC_URLS[1],
//   appName: "Parcel",
// });

export const ledger = new LedgerConnector({
  chainId: networkId,
  url: RPC_URLS[networkId],
  pollingInterval: POLLING_INTERVAL,
});

export const trezor = new TrezorConnector({
  chainId: networkId,
  url: RPC_URLS[networkId],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: "dummy@parcel.money",
  manifestAppUrl: "http://localhost:7000",
});

export const fortmatic = new FortmaticConnector({
  apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  chainId: networkId,
});

export const ConnectorNames = {
  Metamask: "Metamask",
  WalletConnect: "WalletConnect",
  Coinbase: "Coinbase",
  Ledger: "Ledger",
  Trezor: "Trezor",
  Fortmatic: "Fortmatic",
};

export const connectorsByName = {
  [ConnectorNames.Metamask]: {
    connector: injected,
    icon: MetamaskIcon,
  },
  [ConnectorNames.WalletConnect]: {
    connector: walletconnect,
    icon: WalletConnectIcon,
  },
  [ConnectorNames.Ledger]: {
    connector: ledger,
    icon: LedgerIcon,
  },
  [ConnectorNames.Trezor]: {
    connector: trezor,
    icon: TrezorIcon,
  },
  [ConnectorNames.Fortmatic]: {
    connector: fortmatic,
    icon: FortmaticIcon,
  },
};
