/**
 * Dashboard saga
 */

import { call, put, takeLatest } from "redux-saga/effects";

import { GET_SAFE_BALANCES } from "./action-types";
import { getSafeBalancesSuccess, getSafeBalancesError } from "./actions";
import request from "utils/request";
import { gnosisSafeTransactionEndpoint } from "constants/endpoints";

export function* getSafeBalancesFromGnosis(action) {
  const requestURL = `${gnosisSafeTransactionEndpoint}${action.safeAddress}/balances/usd/`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    // const balances = yield result &&
    //   result.reduce((bal, res) => {
    //     if (res.tokenAddress && res.token) {
    //       bal.push(res);
    //     }
    //     return bal;
    //   }, []);
    yield put(getSafeBalancesSuccess(result));
  } catch (err) {
    yield put(getSafeBalancesError(err));
  }
}

export default function* watchGetSafeBalances() {
  yield takeLatest(GET_SAFE_BALANCES, getSafeBalancesFromGnosis);
}
