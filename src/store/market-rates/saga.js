import { call, put, takeLatest } from "redux-saga/effects";
import { GET_MARKET_RATES } from "./action-types";
import { getMarketRatesSuccess, getMarketRatesError } from "./actions";
import request from "utils/request";
import { getTokenPricesEndpoint } from "constants/endpoints";

export function* getMarketRates(action) {
  const requestURL = `${getTokenPricesEndpoint}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getMarketRatesError(result.log));
    } else {
      yield put(getMarketRatesSuccess(result.prices));
    }
  } catch (err) {
    yield put(getMarketRatesError(err));
  }
}

export default function* watchGetMarketRates() {
  yield takeLatest(GET_MARKET_RATES, getMarketRates);
}
