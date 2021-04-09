import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectModifyTeammate = (state) => state.modifyTeammate || initialState;

const makeSelectUpdating = () =>
  createSelector(
    selectModifyTeammate,
    (modifyTeammateState) => modifyTeammateState.updating
  );

const makeSelectError = () =>
  createSelector(
    selectModifyTeammate,
    (modifyTeammateState) => modifyTeammateState.error
  );

export { selectModifyTeammate, makeSelectUpdating, makeSelectError };
