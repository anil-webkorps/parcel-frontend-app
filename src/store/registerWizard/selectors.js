/**
 * The register state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectRegisterWizard = (state) => state.registerWizard || initialState;

const makeSelectStep = () =>
  createSelector(
    selectRegisterWizard,
    (registerWizardState) => registerWizardState.step
  );

const makeSelectFormData = () =>
  createSelector(
    selectRegisterWizard,
    (registerWizardState) => registerWizardState.form
  );

export { selectRegisterWizard, makeSelectStep, makeSelectFormData };
