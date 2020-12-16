import {
  GET_GAS_PRICE,
  GET_GAS_PRICE_SUCCESS,
  GET_GAS_PRICE_ERROR,
} from "./action-types";

export function getGasPrice(safeAddress) {
  return {
    type: GET_GAS_PRICE,
  };
}

export function getGasPriceSuccess({ slow, average, fast }, log) {
  return {
    type: GET_GAS_PRICE_SUCCESS,
    slow,
    average,
    fast,
    log,
  };
}

export function getGasPriceError(error) {
  return {
    type: GET_GAS_PRICE_ERROR,
    error,
  };
}
