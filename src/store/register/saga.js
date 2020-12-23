import { call, put, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import { REGISTER_USER } from "./action-types";
import { registerUserSuccess, registerUserError } from "./actions";
import request from "utils/request";
// import { makeSelectUsername } from "containers/HomePage/selectors";
import { registerEndpoint } from "constants/endpoints";

export function* registerUser(action) {
  // Select username from store
  // const username = yield select(makeSelectUsername());
  const requestURL = registerEndpoint;
  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    // Call our request helper (see 'utils/request')
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(registerUserError(result.log));
    } else {
      localStorage.setItem("token", result.access_token);
      yield put(registerUserSuccess(result.transactionHash, result.log));
      if (action.redirect) yield put(push("/dashboard"));
    }
  } catch (err) {
    yield put(registerUserError(err));
  }
}

export default function* watchRegister() {
  yield takeLatest(REGISTER_USER, registerUser);
}
