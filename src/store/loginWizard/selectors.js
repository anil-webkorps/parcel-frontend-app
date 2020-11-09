/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLoginWizard = (state) => state.loginWizard || initialState;

const makeSelectStep = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.step
  );

const makeSelectFormData = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.form
  );

const makeSelectSelectedSafe = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.selectedSafe
  );

const makeSelectLoading = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.loading
  );

const makeSelectSafes = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.safes
  );

const makeSelectError = () =>
  createSelector(
    selectLoginWizard,
    (loginWizardState) => loginWizardState.error
  );

export {
  selectLoginWizard,
  makeSelectStep,
  makeSelectFormData,
  makeSelectSelectedSafe,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectError,
};
