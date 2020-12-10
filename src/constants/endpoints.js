import { networkNames } from "./networks";

const ROOT_BE_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:2000"
    : "https://api.parcel.money";

// REGISTER
export const registerEndpoint = `${ROOT_BE_URL}/api/v1/users/create`;

// LOGIN
export const fetchSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/fetch-safes`;
export const getSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-safes`;
export const getParcelSafesEndpoint = `${ROOT_BE_URL}/api/v1/users/get-parcel-safes`;
export const loginEndpoint = `${ROOT_BE_URL}/api/v1/users/login`;

// TEAMMATE
export const getAllTeammatesEndpoint = `${ROOT_BE_URL}/api/v1/people/get`;
export const createTeammateEndpoint = `${ROOT_BE_URL}/api/v1/people/create`;
export const createBulkTeammatesEndpoint = `${ROOT_BE_URL}/api/v1/people/add-multiple`;
export const getTeammatesByDepartmentIdEndpoint = `${ROOT_BE_URL}/api/v1/people/getByDepartment`;

// DEPARTMENT
export const createDepartmentEndpoint = `${ROOT_BE_URL}/api/v1/departments/create`;
export const getAllDepartmentsEndpoint = `${ROOT_BE_URL}/api/v1/departments/get`;
export const getDepartmentByIdEndpoint = `${ROOT_BE_URL}/api/v1/departments/getByDepartmentId`;

// TOKEN PRICES
export const getTokenPricesEndpoint = `${ROOT_BE_URL}/api/v1/tokenPrices/usd`;

// GNOSIS
export const gnosisSafeTransactionEndpoint =
  process.env.REACT_APP_NETWORK_NAME === networkNames.MAINNET
    ? `https://safe-transaction.gnosis.io/api/v1/safes/`
    : `https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/`;
