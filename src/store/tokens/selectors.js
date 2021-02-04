/**
 * The tokens state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectTokens = (state) => state.tokens || initialState;

const makeselectTokens = () =>
  createSelector(selectTokens, (tokensState) => tokensState.tokens);

const makeSelectLoading = () =>
  createSelector(selectTokens, (tokensState) => tokensState.loading);

const makeSelectUpdating = () =>
  createSelector(selectTokens, (tokensState) => tokensState.updating);

const makeSelectError = () =>
  createSelector(selectTokens, (tokensState) => tokensState.error);

export {
  selectTokens,
  makeselectTokens,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
