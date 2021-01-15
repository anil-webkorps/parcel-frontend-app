import { call, put, fork, takeLatest } from "redux-saga/effects";
import {
  CONFIRM_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION,
  GET_MULTISIG_TRANSACTIONS,
  SUBMIT_MULTISIG_TRANSACTION,
} from "./action-types";
import {
  getMultisigTransactionsSuccess,
  getMultisigTransactionsError,
  createMultisigTransactionSuccess,
  createMultisigTransactionError,
  confirmMultisigTransactionSuccess,
  confirmMultisigTransactionError,
  submitMultisigTransactionSuccess,
  submitMultisigTransactionError,
} from "./actions";
import request from "utils/request";
import {
  createMultisigTransactionEndpoint,
  getMultisigTransactionEndpoint,
  confirmMultisigTransactionEndpoint,
  submitMultisigTransactionEndpoint,
} from "constants/endpoints";

function* getMultisigTransactions(action) {
  const requestURL = `${getMultisigTransactionEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(getMultisigTransactionsSuccess(result.transactions));
  } catch (err) {
    yield put(getMultisigTransactionsError(err));
  }
}

function* createMultisigTransaction(action) {
  const requestURL = `${createMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      createMultisigTransactionSuccess(result.transactionId, result.log)
    );
  } catch (err) {
    yield put(createMultisigTransactionError(err));
  }
}

function* confirmMultisigTransaction(action) {
  const requestURL = `${confirmMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      confirmMultisigTransactionSuccess(result.transactionId, result.log)
    );
  } catch (err) {
    yield put(confirmMultisigTransactionError(err));
  }
}

function* submitMultisigTransaction(action) {
  const requestURL = `${submitMultisigTransactionEndpoint}`;

  const options = {
    method: "POST",
    body: JSON.stringify(action.body),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      submitMultisigTransactionSuccess(result.transactionHash, result.log)
    );
  } catch (err) {
    yield put(submitMultisigTransactionError(err));
  }
}

function* watchGetMultisigTransactions() {
  yield takeLatest(GET_MULTISIG_TRANSACTIONS, getMultisigTransactions);
}

function* watchCreateMultisigTransaction() {
  yield takeLatest(CREATE_MULTISIG_TRANSACTION, createMultisigTransaction);
}

function* watchConfirmMultisigTransaction() {
  yield takeLatest(CONFIRM_MULTISIG_TRANSACTION, confirmMultisigTransaction);
}

function* watchSubmitMultisigTransaction() {
  yield takeLatest(SUBMIT_MULTISIG_TRANSACTION, submitMultisigTransaction);
}

export default function* multisig() {
  yield fork(watchGetMultisigTransactions);
  yield fork(watchCreateMultisigTransaction);
  yield fork(watchConfirmMultisigTransaction);
  yield fork(watchSubmitMultisigTransaction);
}
