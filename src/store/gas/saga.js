import { call, put, takeLatest } from "redux-saga/effects";
import { GET_GAS_PRICE } from "./action-types";
import { getGasPriceSuccess, getGasPriceError } from "./actions";
import request from "utils/request";
import { ethGasStationEndpoint } from "constants/endpoints";
import { ONE_GWEI } from "constants/index";
import { BigNumber } from "@ethersproject/bignumber";

export function* getGasPrices() {
  const requestURL = `${ethGasStationEndpoint}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    yield put(
      getGasPriceSuccess({
        slow: BigNumber.from(String(result["average"])).mul(
          BigNumber.from(ONE_GWEI)
        ),
        average: BigNumber.from(String(result["fast"])).mul(
          BigNumber.from(ONE_GWEI)
        ),
        fast: BigNumber.from(String(result["fastest"])).mul(
          BigNumber.from(ONE_GWEI)
        ),
      })
    );
  } catch (err) {
    yield put(getGasPriceError(err));
  }
}

export default function* watchGetGasPrices() {
  yield takeLatest(GET_GAS_PRICE, getGasPrices);
}
