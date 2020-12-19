/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from "redux-saga/effects";
import { push } from "connected-react-router";
import { LOGOUT_USER } from "./action-types";
import { logoutUser } from "./actions";

export function* logout() {
  yield invalidateSession();
}

function* invalidateSession() {
  yield put(logoutUser());
  localStorage.removeItem("token");
  yield put(push("/"));
}

export default function* watchLogout() {
  yield takeLatest(LOGOUT_USER, logout);
}
