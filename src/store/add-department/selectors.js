/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectAddDepartment = (state) => state.addDepartment || initialState;

const makeSelectFormData = () =>
  createSelector(
    selectAddDepartment,
    (addDepartmentState) => addDepartmentState.form
  );

const makeSelectLoading = () =>
  createSelector(
    selectAddDepartment,
    (addDepartmentState) => addDepartmentState.loading
  );

const makeSelectError = () =>
  createSelector(
    selectAddDepartment,
    (addDepartmentState) => addDepartmentState.error
  );

export {
  selectAddDepartment,
  makeSelectFormData,
  makeSelectLoading,
  makeSelectError,
};
