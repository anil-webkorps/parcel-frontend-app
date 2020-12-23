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

const makeSelectDepartmentId = () =>
  createSelector(
    selectAddDepartment,
    (addDepartmentState) => addDepartmentState.departmentId
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
  makeSelectDepartmentId,
  makeSelectLoading,
  makeSelectError,
};
