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

const makeSelectChosenDepartment = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.chosenDepartment
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
  makeSelectChosenDepartment,
  makeSelectLoading,
  makeSelectError,
};
