/**
 * The transactions state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectTransactions = (state) => state.transactions || initialState;

const makeSelectTransactions = () =>
  createSelector(
    selectTransactions,
    (transactionsState) => transactionsState.transactions
  );

const makeSelectLoading = () =>
  createSelector(
    selectTransactions,
    (transactionsState) => transactionsState.loading
  );

const makeSelectError = () =>
  createSelector(
    selectTransactions,
    (transactionsState) => transactionsState.error
  );

export {
  selectTransactions,
  makeSelectTransactions,
  makeSelectLoading,
  makeSelectError,
};
