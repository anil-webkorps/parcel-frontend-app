/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectAddTeammate = (state) => state.addTeammate || initialState;

const makeSelectStep = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.step
  );

const makeSelectFormData = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.form
  );

const makeSelectLoading = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.loading
  );

const makeSelectDepartments = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.departments
  );
const makeSelectTotalEmployees = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.totalEmployees
  );

const makeSelectChosenDepartment = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.chosenDepartment
  );

const makeSelectPayCycleDate = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.payCycleDate
  );

const makeSelectError = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.error
  );

export {
  selectAddTeammate,
  makeSelectStep,
  makeSelectFormData,
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectChosenDepartment,
  makeSelectPayCycleDate,
  makeSelectLoading,
  makeSelectError,
};
