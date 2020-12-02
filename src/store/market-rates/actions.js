import {
  GET_MARKET_RATES,
  GET_MARKET_RATES_SUCCESS,
  GET_MARKET_RATES_ERROR,
} from "./action-types";

export function getMarketRates(safeAddress) {
  return {
    type: GET_MARKET_RATES,
  };
}

export function getMarketRatesSuccess(prices, log) {
  return {
    type: GET_MARKET_RATES_SUCCESS,
    prices,
    log,
  };
}

export function getMarketRatesError(error) {
  return {
    type: GET_MARKET_RATES_ERROR,
    error,
  };
}
