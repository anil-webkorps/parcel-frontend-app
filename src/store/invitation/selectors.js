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

const makeSelectSuccess = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.success
  );

const makeSelectCreating = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.creating
  );

const makeSelectApproving = () =>
  createSelector(
    selectInvitation,
    (invitationState) => invitationState.approving
  );

export {
  selectInvitation,
  makeSelectSafeOwners,
  makeSelectLoading,
  makeSelectError,
  makeSelectSuccess,
  makeSelectCreating,
  makeSelectApproving,
};
