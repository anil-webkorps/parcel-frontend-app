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

const makeSelectFlow = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.flow
  );

const makeSelectLoading = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.loading
  );

const makeSelectSuccess = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.success
  );

const makeSelectChosenDepartment = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.chosenDepartment
  );

const makeSelectUpdating = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.updating
  );

const makeSelectError = () =>
  createSelector(
    selectAddTeammate,
    (addTeammateState) => addTeammateState.error
  );

export {
  selectAddTeammate,
  makeSelectStep,
  makeSelectFlow,
  makeSelectFormData,
  makeSelectSuccess,
  makeSelectChosenDepartment,
  makeSelectLoading,
  makeSelectUpdating,
  makeSelectError,
};
