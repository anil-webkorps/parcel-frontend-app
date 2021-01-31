import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  CREATE_META_TX,
  CREATE_META_TX_SUCCESS,
  CREATE_META_TX_ERROR,
} from "./action-types";

export function registerUser(body, redirect = true) {
  return {
    type: REGISTER_USER,
    body,
    redirect,
  };
}

export function registerUserSuccess(transactionHash, log) {
  return {
    type: REGISTER_USER_SUCCESS,
    transactionHash,
    log,
  };
}

export function registerUserError(error) {
  return {
    type: REGISTER_USER_ERROR,
    error,
  };
}

export function createMetaTx(body) {
  return {
    type: CREATE_META_TX,
    body,
  };
}

export function createMetaTxSuccess(transactionHash, log) {
  return {
    type: CREATE_META_TX_SUCCESS,
    transactionHash,
    log,
  };
}

export function createMetaTxError(error) {
  return {
    type: CREATE_META_TX_ERROR,
    error,
  };
}
