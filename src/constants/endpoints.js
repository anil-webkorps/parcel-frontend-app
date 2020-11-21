import { networkNames } from "./networks";

const ROOT_BE_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:2000"
    : "https://api.parcel.money";

export const registerEndPoint = `${ROOT_BE_URL}/api/v1/users/create`;
export const fetchSafesEndPoint = `${ROOT_BE_URL}/api/v1/users/fetch-safes`;
export const getSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-safes`;
export const getParcelSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-parcel-safes`;
export const loginEndpoint = `${ROOT_BE_URL}/api/v1/users/login`;
export const gnosisSafeTransactionEndpoint =
  process.env.REACT_APP_NETWORK_NAME === networkNames.MAINNET
    ? `https://safe-transaction.gnosis.io/api/v1/safes/`
    : `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/`;
