import { call, put, fork, takeLatest } from "redux-saga/effects";
import { ADD_TEAMMATE, GET_DEPARTMENTS } from "./action-types";
import {
  getDepartmentsSuccess,
  getDepartmentsError,
  addTeammateSuccess,
  addTeammateError,
} from "./actions";
import request from "utils/request";
import {
  getAllDepartmentsEndpoint,
  createTeammateEndpoint,
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
      yield put(getDepartmentsSuccess(result.departments, result.log));
    }
  } catch (err) {
    yield put(getDepartmentsError(err));
  }
}

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
      yield put(addTeammateSuccess(result.departments, result.log));
    }
  } catch (err) {
    yield put(addTeammateError(err));
  }
}

function* watchGetDepartments() {
  yield takeLatest(GET_DEPARTMENTS, getDepartments);
}

function* watchAddTeammate() {
  yield takeLatest(ADD_TEAMMATE, createTeammate);
}

export default function* addTeammate() {
  yield fork(watchGetDepartments);
  yield fork(watchAddTeammate);
}
