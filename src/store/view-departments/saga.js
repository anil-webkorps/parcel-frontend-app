import { call, put, takeLatest } from "redux-saga/effects";
import { GET_DEPARTMENTS } from "./action-types";
import { getDepartmentsSuccess, getDepartmentsError } from "./actions";
import request from "utils/request";
import { getAllDepartmentsEndpoint } from "constants/endpoints";

export function* getDepartments(action) {
  const requestURL = `${getAllDepartmentsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getDepartmentsSuccess([], 0, result.log));
    } else {
      yield put(
        getDepartmentsSuccess(
          result.departments,
          result.totalEmployees,
          result.log
        )
      );
    }
  } catch (err) {
    yield put(getDepartmentsError(err));
  }
}

export default function* watchGetDepartments() {
  yield takeLatest(GET_DEPARTMENTS, getDepartments);
}
