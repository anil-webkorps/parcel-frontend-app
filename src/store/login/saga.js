/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeLatest } from "redux-saga/effects";
import { LOGIN_USER } from "./action-types";
import { loginUserSuccess, loginUserError } from "./actions";
import request from "utils/request";
// import { makeSelectUsername } from "containers/HomePage/selectors";
import { loginEndpoint } from "constants/endpoints";

export function* loginUser(action) {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  const requestURL = loginEndpoint;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(loginUserError(result.log));
    } else {
      yield put(loginUserSuccess(result.transactionHash, result.log));
    }
  } catch (err) {
    yield put(loginUserError(err));
  }
}

export default function* watchLogin() {
  yield takeLatest(LOGIN_USER, loginUser);
}
