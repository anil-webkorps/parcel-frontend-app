import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_NONCE, GET_OWNERS_AND_THRESHOLD } from "./action-types";
import {
  getOwnersAndThresholdSuccess,
  getOwnersAndThresholdError,
  getNonceSuccess,
  getNonceError,
} from "./actions";
import request from "utils/request";
import { gnosisSafeTransactionEndpoint } from "constants/endpoints";

function* getSafeDetailsFromGnosis(action) {
  const requestURL = `${gnosisSafeTransactionEndpoint}/${action.safeAddress}`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      getOwnersAndThresholdSuccess({
        owners: result.owners,
        threshold: result.threshold,
      })
    );
  } catch (err) {
    yield put(getOwnersAndThresholdError(err));
  }
}

function* getTransactionNonce(action) {
  const requestURL = `${gnosisSafeTransactionEndpoint}${action.safeAddress}/transactions/?has_confirmations=True`;

  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getNonceSuccess(result.count, result.countUniqueNonce));
  } catch (err) {
    yield put(getNonceError(err));
  }
}

function* watchGetOwnersAndThreshold() {
  yield takeLatest(GET_OWNERS_AND_THRESHOLD, getSafeDetailsFromGnosis);
}

function* watchGetNonce() {
  yield takeLatest(GET_NONCE, getTransactionNonce);
}

export default function* safe() {
  yield fork(watchGetOwnersAndThreshold);
  yield fork(watchGetNonce);
}
