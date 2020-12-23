export const networkNames = {
  LOCAL: "LOCAL",
  RINKEBY: "RINKEBY",
  ROPSTEN: "ROPSTEN",
  KOVAN: "KOVAN",
  MAINNET: "MAINNET",
};

export const chainIds = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  KOVAN: 42,
};

export function findNetworkNameByWeb3ChainId(chainId) {
  switch (chainId) {
    case chainIds.MAINNET:
      return networkNames.MAINNET;
    case chainIds.ROPSTEN:
      return networkNames.ROPSTEN;
    case chainIds.RINKEBY:
      return networkNames.RINKEBY;
    case chainIds.KOVAN:
      return networkNames.KOVAN;
    default:
      return "Unknown Network";
  }
}
