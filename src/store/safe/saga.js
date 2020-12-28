import { call, put, fork, takeLatest } from "redux-saga/effects";
import { CREATE_MULTISIG_TRANSACTION, GET_SAFE_DETAILS } from "./action-types";
import {
  getSafeDetailsSuccess,
  getSafeDetailsError,
  createMultisigTransactionSuccess,
  createMultisigTransactionError,
} from "./actions";
import request from "utils/request";
import { gnosisSafeEndpoint } from "constants/endpoints";

function* getSafeDetailsFromGnosis(action) {
  const requestURL = `${gnosisSafeEndpoint}/${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      getSafeDetailsSuccess({
        nonce: result.nonce,
        owners: result.owners,
        threshold: result.threshold,
      })
    );
  } catch (err) {
    yield put(getSafeDetailsError(err));
  }
}

function* createSafeTransaction({
  safeAddress,
  to,
  value,
  data,
  operation,
  gasToken,
  safeTxGas,
  baseGas,
  gasPrice,
  refundReceiver,
  nonce,
  contractTransactionHash,
  sender,
  signature,
  origin,
}) {
  const requestURL = `${gnosisSafeEndpoint}/${safeAddress}/transactions/`;

  const options = {
    method: "POST",
    body: JSON.stringify({
      safe: safeAddress,
      to,
      value,
      data,
      operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      contractTransactionHash,
      sender,
      signature,
      origin,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    yield call(request, requestURL, options);
    yield put(
      createMultisigTransactionSuccess({
        success: true,
      })
    );
  } catch (err) {
    yield put(createMultisigTransactionError(err));
  }
}

function* watchGetSafeDetails() {
  yield takeLatest(GET_SAFE_DETAILS, getSafeDetailsFromGnosis);
}

function* watchCreateSafeTransaction() {
  yield takeLatest(CREATE_MULTISIG_TRANSACTION, createSafeTransaction);
}

export default function* safe() {
  yield fork(watchGetSafeDetails);
  yield fork(watchCreateSafeTransaction);
}
