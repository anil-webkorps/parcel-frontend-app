import {
  GET_SAFE_BALANCES,
  GET_SAFE_BALANCES_SUCCESS,
  GET_SAFE_BALANCES_ERROR,
} from "./action-types";

export function getSafeBalances(safeAddress) {
  return {
    type: GET_SAFE_BALANCES,
    safeAddress,
  };
}

export function getSafeBalancesSuccess(balances) {
  return {
    type: GET_SAFE_BALANCES_SUCCESS,
    balances,
  };
}

export function getSafeBalancesError(error) {
  return {
    type: GET_SAFE_BALANCES_ERROR,
    error,
  };
}
