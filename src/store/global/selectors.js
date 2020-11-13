/**
 * The global state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectGlobal = (state) => state.global || initialState;

const makeSelectOwnerName = () =>
  createSelector(selectGlobal, (globalState) => globalState.name);

const makeSelectOwnerSafeAddress = () =>
  createSelector(selectGlobal, (globalState) => globalState.ownerSafeAddress);

export { makeSelectOwnerName, makeSelectOwnerSafeAddress };
