import { call, put, fork, takeLatest } from "redux-saga/effects";
import {
  ADD_TEAMMATE,
  GET_DEPARTMENT_BY_ID,
  ADD_BULK_TEAMMATE,
} from "./action-types";
import {
  addTeammateSuccess,
  addTeammateError,
  addBulkTeammatesSuccess,
  addBulkTeammatesError,
  getDepartmentByIdSuccess,
  getDepartmentByIdError,
} from "./actions";
import request from "utils/request";
import {
  createTeammateEndpoint,
  createBulkTeammatesEndpoint,
  getDepartmentByIdEndpoint,
} from "constants/endpoints";

export function* createTeammate({ body }) {
  const requestURL = `${createTeammateEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      encryptedEmployeeDetails: body.encryptedEmployeeDetails,
      payCycleDate: body.payCycleDate,
      safeAddress: body.safeAddress,
      createdBy: body.createdBy,
      departmentId: body.departmentId,
      departmentName: body.departmentName,
      joiningDate: Date.now(),
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addTeammateError(result.log));
    } else {
      yield put(addTeammateSuccess());
    }
  } catch (err) {
    yield put(addTeammateError(err));
  }
}

export function* createBulkTeammates({ safeAddress, createdBy, data }) {
  const requestURL = `${createBulkTeammatesEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      safeAddress,
      createdBy,
      data,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addBulkTeammatesError(result.log));
    } else {
      yield put(addBulkTeammatesSuccess());
    }
  } catch (err) {
    yield put(addBulkTeammatesError(err));
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

function* watchAddTeammate() {
  yield takeLatest(ADD_TEAMMATE, createTeammate);
}

function* watchAddBulkTeammates() {
  yield takeLatest(ADD_BULK_TEAMMATE, createBulkTeammates);
}

function* watchGetDepartmentById() {
  yield takeLatest(GET_DEPARTMENT_BY_ID, getDepartmentById);
}

export default function* addTeammate() {
  yield fork(watchAddTeammate);
  yield fork(watchAddBulkTeammates);
  yield fork(watchGetDepartmentById);
}
