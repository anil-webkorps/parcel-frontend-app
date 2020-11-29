import { call, put, takeLatest } from "redux-saga/effects";
import { ADD_TEAMMATE } from "./action-types";
import { addTeammateSuccess, addTeammateError } from "./actions";
import request from "utils/request";
import { createTeammateEndpoint } from "constants/endpoints";

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

export default function* watchAddTeammate() {
  yield takeLatest(ADD_TEAMMATE, createTeammate);
}
