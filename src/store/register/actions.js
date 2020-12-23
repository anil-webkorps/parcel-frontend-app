import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
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
