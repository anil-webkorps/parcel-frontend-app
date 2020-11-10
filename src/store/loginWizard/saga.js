/**
 * loginWizard Saga
 */

import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_SAFES, FETCH_SAFES } from "./action-types";
import {
  getSafes as getSafesRequest,
  getSafesSuccess,
  getSafesError,
} from "./actions";
import request from "utils/request";
import { getSafesEndpoint, fetchSafesEndPoint } from "constants/endpoints";

export function* getSafes(action) {
  const requestURL = `${getSafesEndpoint}?owner=${action.owner}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      yield put(getSafesSuccess(result.safes, result.log));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

export function* fetchSafes(action) {
  const requestURL = `${fetchSafesEndPoint}?owner=${action.owner}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getSafesError(result.log));
    } else {
      // Fetch safes api will make a call that will return in ~20 seconds
      yield put(getSafesSuccess([], result.log));
      yield put(getSafesRequest(action.owner));
    }
  } catch (err) {
    yield put(getSafesError(err));
  }
}

function* watchGetSafes() {
  yield takeLatest(GET_SAFES, getSafes);
}

function* watchFetchSafes() {
  yield takeLatest(FETCH_SAFES, fetchSafes);
}

export default function* safes() {
  yield fork(watchGetSafes);
  yield fork(watchFetchSafes);
}
