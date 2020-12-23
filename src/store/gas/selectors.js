import { createSelector } from "reselect";
import { initialState } from "./reducer";

const seelctGasPrices = (state) => state.gas || initialState;

const makeSelectLoading = () =>
  createSelector(seelctGasPrices, (gasPriceState) => gasPriceState.loading);

const makeSelectSlowGasPrice = () =>
  createSelector(seelctGasPrices, (gasPriceState) => gasPriceState.slow);

const makeSelectAverageGasPrice = () =>
  createSelector(seelctGasPrices, (gasPriceState) => gasPriceState.average);

const makeSelectFastGasPrice = () =>
  createSelector(seelctGasPrices, (gasPriceState) => gasPriceState.fast);

const makeSelectError = () =>
  createSelector(seelctGasPrices, (gasPriceState) => gasPriceState.error);

export {
  seelctGasPrices,
  makeSelectSlowGasPrice,
  makeSelectAverageGasPrice,
  makeSelectFastGasPrice,
  makeSelectLoading,
  makeSelectError,
};
