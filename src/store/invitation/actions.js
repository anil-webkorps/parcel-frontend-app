import {
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  GET_INVITATIONS_ERROR,
  CREATE_INVITATION,
  CREATE_INVITATION_SUCCESS,
  CREATE_INVITATION_ERROR,
  ACCEPT_INVITATION,
  ACCEPT_INVITATION_SUCCESS,
  ACCEPT_INVITATION_ERROR,
  APPROVE_INVITATION,
  APPROVE_INVITATION_SUCCESS,
  APPROVE_INVITATION_ERROR,
} from "./action-types";

export function getInvitations(safeAddress) {
  return {
    type: GET_INVITATIONS,
    safeAddress,
  };
}

export function getInvitationsSuccess(owners, createdBy, log) {
  return {
    type: GET_INVITATIONS_SUCCESS,
    owners,
    createdBy,
    log,
  };
}

export function getInvitationsError(error) {
  return {
    type: GET_INVITATIONS_ERROR,
    error,
  };
}

export function createInvitation(body) {
  return {
    type: CREATE_INVITATION,
    body,
  };
}

export function createInvitationSuccess(invitationLink, log) {
  return {
    type: CREATE_INVITATION_SUCCESS,
    invitationLink,
    log,
  };
}

export function createInvitationError(error) {
  return {
    type: CREATE_INVITATION_ERROR,
    error,
  };
}

export function acceptInvitation(publicKey, invitationToken) {
  return {
    type: ACCEPT_INVITATION,
    publicKey,
    invitationToken,
  };
}

export function acceptInvitationSuccess(log) {
  return {
    type: ACCEPT_INVITATION_SUCCESS,
    log,
  };
}

export function acceptInvitationError(error) {
  return {
    type: ACCEPT_INVITATION_ERROR,
    error,
  };
}

export function approveInvitation(encryptionKeyData, invitationId) {
  return {
    type: APPROVE_INVITATION,
    encryptionKeyData,
    invitationId,
  };
}

export function approveInvitationSuccess(log) {
  return {
    type: APPROVE_INVITATION_SUCCESS,
    log,
  };
}

export function approveInvitationError(error) {
  return {
    type: APPROVE_INVITATION_ERROR,
    error,
  };
}
