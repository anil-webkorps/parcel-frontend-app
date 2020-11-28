import { takeLatest, put, fork, call } from "redux-saga/effects";
import { GET_ALL_TEAMMATES, GET_TEAMMATES_BY_DEPARTMENT } from "./action-types";
import {
  getAllTeammatesSuccess,
  getAllTeammatesError,
  getTeammatesByDepartmentSuccess,
  getTeammatesByDepartmentError,
} from "./actions";
import request from "utils/request";
import {
  getAllTeammatesEndpoint,
  getTeammatesByDepartmentIdEndPoint,
} from "constants/endpoints";

function* fetchAllTeammates(action) {
  const requestURL = `${getAllTeammatesEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      // no teammates
      yield put(getTeammatesByDepartmentSuccess([]));
    } else if (result.flag !== 200) {
      yield put(getAllTeammatesError(result.log));
    } else {
      yield put(getAllTeammatesSuccess(result.employees));
    }
  } catch (err) {
    yield put(getAllTeammatesError(err));
  }
}

function* fetchTeammatesByDepartmentId(action) {
  const requestURL = `${getTeammatesByDepartmentIdEndPoint}?safeAddress=${action.safeAddress}&departmentId=${action.departmentId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag === 400) {
      yield put(getTeammatesByDepartmentSuccess([]));
    } else if (result.flag !== 200) {
      yield put(getTeammatesByDepartmentError(result.log));
    } else {
      yield put(getTeammatesByDepartmentSuccess(result.employees));
    }
  } catch (err) {
    yield put(getTeammatesByDepartmentError(err));
  }
}

function* watchGetAllTeammates() {
  yield takeLatest(GET_ALL_TEAMMATES, fetchAllTeammates);
}

function* watchGetTeammatesByDepartmentId() {
  yield takeLatest(GET_TEAMMATES_BY_DEPARTMENT, fetchTeammatesByDepartmentId);
}

export default function* teammates() {
  yield fork(watchGetAllTeammates);
  yield fork(watchGetTeammatesByDepartmentId);
}
