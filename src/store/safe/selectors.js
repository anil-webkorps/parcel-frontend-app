import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectSafeDetails = (state) => state.safe || initialState;

const makeSelectLoading = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.loading);

const makeSelectOwners = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.owners);

const makeSelectThreshold = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.threshold);

const makeSelectIsMultiOwner = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.threshold > 1);

const makeSelectNonce = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.nonce);

const makeSelectError = () =>
  createSelector(selectSafeDetails, (safeState) => safeState.error);

export {
  selectSafeDetails,
  makeSelectOwners,
  makeSelectThreshold,
  makeSelectIsMultiOwner,
  makeSelectNonce,
  makeSelectLoading,
  makeSelectError,
};
