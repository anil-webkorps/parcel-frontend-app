import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectViewTeams = (state) => state.viewTeams || initialState;

const makeSelectLoading = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.loading);

const makeSelectDepartments = () =>
  createSelector(
    selectViewTeams,
    (viewTeamsState) => viewTeamsState.departments
  );
const makeSelectTeammatesCount = () =>
  createSelector(
    selectViewTeams,
    (viewTeamsState) => viewTeamsState.teammatesCount
  );

const makeSelectError = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.error);

export {
  selectViewTeams,
  makeSelectDepartments,
  makeSelectTeammatesCount,
  makeSelectLoading,
  makeSelectError,
};
