import { InjectedConnector } from "@web3-react/injected-connector";
import { NetworkConnector } from "@web3-react/network-connector";

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
  supportedChainIds: [1, 3, 4, 5, 42],
});
