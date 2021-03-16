/**
 * The login state selectors
 */

import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectViewTeammates = (state) => state.viewTeammates || initialState;

const makeSelectTeammates = () =>
  createSelector(
    selectViewTeammates,
    (viewTeammatesState) => viewTeammatesState.teammates
  );

const makeSelectLoading = () =>
  createSelector(
    selectViewTeammates,
    (viewTeammatesState) => viewTeammatesState.loading
  );

const makeSelectDepartmentName = () =>
  createSelector(
    selectViewTeammates,
    (viewTeammatesState) => viewTeammatesState.departmentName
  );

const makeSelectError = () =>
  createSelector(
    selectViewTeammates,
    (viewTeammatesState) => viewTeammatesState.error
  );

export {
  selectViewTeammates,
  makeSelectTeammates,
  makeSelectLoading,
  makeSelectDepartmentName,
  makeSelectError,
};
