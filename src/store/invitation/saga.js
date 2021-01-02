import { call, put, takeLatest } from "redux-saga/effects";
import { GET_INVITATIONS } from "./action-types";
import { getInvitationsSuccess, getInvitationsError } from "./actions";
import request from "utils/request";
import { getInvitationsEndpoint } from "constants/endpoints";

export function* getInvitations(action) {
  const requestURL = `${getInvitationsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getInvitationsError(result.log));
    } else {
      yield put(getInvitationsSuccess(result.owners));
    }
  } catch (err) {
    yield put(getInvitationsError(err));
  }
}

export default function* watchGetInvitations() {
  yield takeLatest(GET_INVITATIONS, getInvitations);
}
