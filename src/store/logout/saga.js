import { takeEvery, put } from "redux-saga/effects";
import { setOwnerDetails } from "store/global/actions";
// import { push } from "connected-react-router";
import { LOGOUT_USER } from "./action-types";

export function* logout() {
  yield invalidateSession();
}

function* invalidateSession() {
  yield localStorage.removeItem("token");
  yield localStorage.removeItem("ENCRYPTION_KEY");
  yield localStorage.removeItem("SIGNATURE");
  yield put(setOwnerDetails("", "", ""));
  window.location = "/";
  // yield put(push("/"));
}

export default function* watchLogout() {
  yield takeEvery(LOGOUT_USER, logout);
}
