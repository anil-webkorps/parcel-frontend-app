import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectMarketRates = (state) => state.marketRates || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectMarketRates,
    (marketRatesState) => marketRatesState.loading
  );

const makeSelectPrices = () =>
  createSelector(
    selectMarketRates,
    (marketRatesState) => marketRatesState.prices
  );

const makeSelectError = () =>
  createSelector(
    selectMarketRates,
    (marketRatesState) => marketRatesState.error
  );

export {
  selectMarketRates,
  makeSelectPrices,
  makeSelectLoading,
  makeSelectError,
};
