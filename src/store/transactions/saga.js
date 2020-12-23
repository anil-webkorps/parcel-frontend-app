import { takeLatest, put, call, fork } from "redux-saga/effects";
import { ADD_TRANSACTION, VIEW_TRANSACTIONS } from "./action-types";
import {
  addTransactionSuccess,
  addTransactionError,
  viewTransactionsSuccess,
  viewTransactionsError,
} from "./actions";
import request from "utils/request";
import {
  createTransactionEndpoint,
  getTransactionsEndpoint,
} from "constants/endpoints";

function* addTransaction({ body }) {
  const requestURL = `${createTransactionEndpoint}`;
  const {
    to,
    safeAddress,
    createdBy,
    transactionHash,
    tokenValue,
    tokenCurrency,
    fiatValue,
    addresses,
    fiatCurrency,
    transactionMode,
  } = body;
  const options = {
    method: "POST",
    body: JSON.stringify({
      to,
      safeAddress,
      createdBy,
      transactionHash,
      tokenValue,
      tokenCurrency,
      fiatValue,
      addresses,
      fiatCurrency,
      transactionMode,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addTransactionError(result.log));
    } else {
      yield put(addTransactionSuccess(result.departmentId, result.log));
    }
  } catch (err) {
    yield put(addTransactionError(err));
  }
}

function* getTransactions(action) {
  const requestURL = `${getTransactionsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(viewTransactionsError(result.log));
    } else {
      yield put(viewTransactionsSuccess(result.transactions, result.log));
    }
  } catch (err) {
    yield put(viewTransactionsError(err));
  }
}

function* watchAddTransaction() {
  yield takeLatest(ADD_TRANSACTION, addTransaction);
}

function* watchGetTransactions() {
  yield takeLatest(VIEW_TRANSACTIONS, getTransactions);
}
export default function* transactions() {
  yield fork(watchAddTransaction);
  yield fork(watchGetTransactions);
}
