import {
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  GET_INVITATIONS_ERROR,
} from "./action-types";

export function getInvitations(safeAddress) {
  return {
    type: GET_INVITATIONS,
    safeAddress,
  };
}

export function getInvitationsSuccess(owners, log) {
  return {
    type: GET_INVITATIONS_SUCCESS,
    owners,
    log,
  };
}

export function getInvitationsError(error) {
  return {
    type: GET_INVITATIONS_ERROR,
    error,
  };
}
