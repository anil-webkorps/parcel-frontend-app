import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from "./action-types";

export function loginUser(safeAddress) {
  return {
    type: LOGIN_USER,
    safeAddress,
  };
}

export function loginUserSuccess(safeAddress, log) {
  return {
    type: LOGIN_USER_SUCCESS,
    safeAddress,
    log,
  };
}

export function loginUserError(error) {
  return {
    type: LOGIN_USER_ERROR,
    error,
  };
}
