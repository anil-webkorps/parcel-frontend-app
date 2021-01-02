import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectInvitation = (state) => state.invitation || initialState;

const makeSelectLoading = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.loading
  );

const makeSelectSafeOwners = () =>
  createSelector(selectInvitation, (invitationState) => invitationState.owners);

const makeSelectError = () =>
  createSelector(selectInvitation, (invitationState) => invitationState.error);

export {
  selectInvitation,
  makeSelectSafeOwners,
  makeSelectLoading,
  makeSelectError,
};
