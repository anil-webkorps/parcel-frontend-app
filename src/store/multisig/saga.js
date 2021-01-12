import { call, put, fork, takeLatest } from "redux-saga/effects";
import {
  CREATE_MULTISIG_TRANSACTION,
  GET_MULTISIG_TRANSACTIONS,
} from "./action-types";
import {
  getMultisigTransactionsSuccess,
  getMultisigTransactionsError,
  createMultisigTransactionSuccess,
  createMultisigTransactionError,
} from "./actions";
import request from "utils/request";
import {
  createMultisigTransactionEndpoint,
  getMultisigTransactionEndpoint,
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

function* watchGetMultisigTransactions() {
  yield takeLatest(GET_MULTISIG_TRANSACTIONS, getMultisigTransactions);
}

function* watchCreateMultisigTransaction() {
  yield takeLatest(CREATE_MULTISIG_TRANSACTION, createMultisigTransaction);
}

export default function* multisig() {
  yield fork(watchGetMultisigTransactions);
  yield fork(watchCreateMultisigTransaction);
}
