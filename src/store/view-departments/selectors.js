import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectViewDepartments = (state) => state.viewDepartments || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectViewDepartments,
    (viewDepartmentsState) => viewDepartmentsState.loading
  );

const makeSelectDepartments = () =>
  createSelector(
    selectViewDepartments,
    (viewDepartmentsState) => viewDepartmentsState.departments
  );
const makeSelectTotalEmployees = () =>
  createSelector(
    selectViewDepartments,
    (viewDepartmentsState) => viewDepartmentsState.totalEmployees
  );

const makeSelectError = () =>
  createSelector(
    selectViewDepartments,
    (viewDepartmentsState) => viewDepartmentsState.error
  );

export {
  selectViewDepartments,
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectLoading,
  makeSelectError,
};
