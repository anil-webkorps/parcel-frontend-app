/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectGlobal = (state) => state.global || initialState;

const makeSelectOwnerName = () =>
  createSelector(selectGlobal, (globalState) => globalState.ownerName);

const makeSelectOwnerSafeAddress = () =>
  createSelector(selectGlobal, (globalState) => globalState.ownerSafeAddress);

const makeSelectCreatedBy = () =>
  createSelector(selectGlobal, (globalState) => globalState.createdBy);

export { makeSelectOwnerName, makeSelectOwnerSafeAddress, makeSelectCreatedBy };
