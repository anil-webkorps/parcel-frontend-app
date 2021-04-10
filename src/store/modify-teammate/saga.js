import { call, put, fork, takeLatest } from "redux-saga/effects";
import { hide } from "redux-modal";

import { EDIT_TEAMMATE, DELETE_TEAMMATE } from "./action-types";
import {
  editTeammateError,
  editTeammateSuccess,
  deleteTeammateSuccess,
  deleteTeammateError,
} from "./actions";
import request from "utils/request";
import {
  editTeammateEndpoint,
  deleteTeammateEndpoint,
} from "constants/endpoints";
import { getAllPeople, getPeopleByDepartment } from "store/view-people/actions";
import { MODAL_NAME as DELETE_TEAMMATE_MODAL } from "components/People/DeleteTeammateModal";

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
        yield put(getPeopleByDepartment(safeAddress, departmentId));
      } else {
        yield put(getAllPeople(safeAddress));
      }
    }
  } catch (err) {
    yield put(deleteTeammateError(err));
  }
}

function* watchEditTeammate() {
  yield takeLatest(EDIT_TEAMMATE, editTeammate);
}

function* watchDeleteTeammate() {
  yield takeLatest(DELETE_TEAMMATE, deleteTeammate);
}

export default function* modifyTeammate() {
  yield fork(watchEditTeammate);
  yield fork(watchDeleteTeammate);
}
