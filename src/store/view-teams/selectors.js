import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectViewTeams = (state) => state.viewTeams || initialState;

const makeSelectLoading = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.loading);

const makeSelectTeamIdToDetailsMap = () =>
  createSelector(
    selectViewTeams,
    (viewTeamsState) =>
      viewTeamsState.teams &&
      viewTeamsState.teams.reduce((map, details) => {
        map[details.departmentId] = details;
        return map;
      }, {})
  );

const makeSelectTeams = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.teams);
const makeSelectPeopleCount = () =>
  createSelector(
    selectViewTeams,
    (viewTeamsState) => viewTeamsState.teammatesCount
  );

const makeSelectError = () =>
  createSelector(selectViewTeams, (viewTeamsState) => viewTeamsState.error);

export {
  selectViewTeams,
  makeSelectTeams,
  makeSelectPeopleCount,
  makeSelectLoading,
  makeSelectError,
  makeSelectTeamIdToDetailsMap
};
