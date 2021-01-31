/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectDashboard = (state) => state.dashboard || initialState;

const makeSelectLoading = () =>
  createSelector(selectDashboard, (dashboardState) => dashboardState.loading);

const makeSelectError = () =>
  createSelector(selectDashboard, (dashboardState) => dashboardState.error);

const makeSelectBalances = () =>
  createSelector(selectDashboard, (dashboardState) => dashboardState.balances);

export {
  selectDashboard,
  makeSelectLoading,
  makeSelectError,
  makeSelectBalances,
};
