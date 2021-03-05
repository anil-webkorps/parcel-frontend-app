import { call, put, fork, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import {
  ADD_TEAMMATE,
  GET_DEPARTMENT_BY_ID,
  ADD_BULK_TEAMMATE,
  EDIT_TEAMMATE,
  DELETE_TEAMMATE,
} from "./action-types";
import {
  addTeammateSuccess,
  addTeammateError,
  addBulkTeammatesSuccess,
  addBulkTeammatesError,
  getDepartmentByIdSuccess,
  getDepartmentByIdError,
  editTeammateError,
  editTeammateSuccess,
  deleteTeammateSuccess,
  deleteTeammateError,
} from "./actions";
import request from "utils/request";
import {
  createTeammateEndpoint,
  createBulkTeammatesEndpoint,
  getDepartmentByIdEndpoint,
  editTeammateEndpoint,
  deleteTeammateEndpoint,
} from "constants/endpoints";
import {
  getAllTeammates,
  getTeammatesByDepartment,
} from "store/view-teammates/actions";
import { MODAL_NAME as DELETE_TEAMMATE_MODAL } from "components/People/DeleteModal";

export function* createTeammate({ body }) {
  const requestURL = `${createTeammateEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      encryptedEmployeeDetails: body.encryptedEmployeeDetails,
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

export function* editTeammate({ body }) {
  const requestURL = `${editTeammateEndpoint}`;
  const options = {
    method: "PUT",
    body: JSON.stringify({
      encryptedEmployeeDetails: body.encryptedEmployeeDetails,
      safeAddress: body.safeAddress,
      createdBy: body.createdBy,
      departmentId: body.departmentId,
      departmentName: body.departmentName,
      joiningDate: Date.now(),
      peopleId: body.peopleId,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(editTeammateError(result.log));
    } else {
      yield put(editTeammateSuccess(result.log));
    }
  } catch (err) {
    yield put(editTeammateError(err));
  }
}
export function* deleteTeammate({ peopleId, safeAddress, departmentId }) {
  const requestURL = `${deleteTeammateEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      peopleId,
      safeAddress,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(deleteTeammateError(result.log));
    } else {
      yield put(deleteTeammateSuccess(result.log));
      yield put(hide(DELETE_TEAMMATE_MODAL));
      if (departmentId) {
        yield put(getTeammatesByDepartment(safeAddress, departmentId));
      } else {
        yield put(getAllTeammates(safeAddress));
      }
    }
  } catch (err) {
    yield put(deleteTeammateError(err));
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

function* watchEditTeammate() {
  yield takeLatest(EDIT_TEAMMATE, editTeammate);
}

function* watchDeleteTeammate() {
  yield takeLatest(DELETE_TEAMMATE, deleteTeammate);
}

export default function* addTeammate() {
  yield fork(watchAddTeammate);
  yield fork(watchAddBulkTeammates);
  yield fork(watchGetDepartmentById);
  yield fork(watchEditTeammate);
  yield fork(watchDeleteTeammate);
}
