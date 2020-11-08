/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLogin = (state) => state.login || initialState;

const makeSelectLoading = () =>
  createSelector(selectLogin, (loginState) => loginState.loading);

const makeSelectError = () =>
  createSelector(selectLogin, (loginState) => loginState.error);

const makeSelectSafeAddress = () =>
  createSelector(selectLogin, (loginState) => loginState.safeAddress);

const makeSelectLog = () =>
  createSelector(selectLogin, (loginState) => loginState.log);

const makeSelectShouldRedirect = () =>
  createSelector(
    selectLogin,
    (loginState) => loginState.makeSelectShouldRedirect
  );

export {
  selectLogin,
  makeSelectLoading,
  makeSelectError,
  makeSelectSafeAddress,
  makeSelectLog,
  makeSelectShouldRedirect,
};
