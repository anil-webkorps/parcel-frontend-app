import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectSafeDetails = (state) => state.safe || initialState;

const makeSelectLoading = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.loading);

const makeSelectOwners = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.owners);
const makeSelectThreshold = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.threshold);
const makeSelectNonce = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.nonce);
const makeSelectSuccess = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.success);
const makeSelectUpdating = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.updating);

const makeSelectError = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.error);

export {
  selectSafeDetails,
  makeSelectOwners,
  makeSelectThreshold,
  makeSelectNonce,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectError,
};
