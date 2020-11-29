import { call, put, fork, takeLatest } from "redux-saga/effects";
import { GET_DEPARTMENTS, GET_DEPARTMENT_BY_ID } from "./action-types";
import {
  getDepartmentsSuccess,
  getDepartmentsError,
  getDepartmentByIdSuccess,
  getDepartmentByIdError,
} from "./actions";
import request from "utils/request";
import {
  getAllDepartmentsEndpoint,
  getDepartmentByIdEndpoint,
} from "constants/endpoints";

export function* getDepartments(action) {
  const requestURL = `${getAllDepartmentsEndpoint}?safeAddress=${action.safeAddress}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getDepartmentsError(result.log));
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

export function* getDepartmentById(action) {
  const requestURL = `${getDepartmentByIdEndpoint}?safeAddress=${action.safeAddress}&departmentId=${action.departmentId}`;
  const options = {
    method: "GET",
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(getDepartmentByIdError(result.log));
    } else {
      yield put(getDepartmentByIdSuccess(result.department, result.log));
    }
  } catch (err) {
    yield put(getDepartmentByIdError(err));
  }
}

function* watchGetDepartments() {
  yield takeLatest(GET_DEPARTMENTS, getDepartments);
}

function* watchGetDepartmentById() {
  yield takeLatest(GET_DEPARTMENT_BY_ID, getDepartmentById);
}

export default function* addTeammate() {
  yield fork(watchGetDepartments);
  yield fork(watchGetDepartmentById);
}
