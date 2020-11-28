import { takeLatest, put, call } from "redux-saga/effects";
import { ADD_DEPARTMENT } from "./action-types";
import { addDepartmentSuccess, addDepartmentError } from "./actions";
import request from "utils/request";
import { createDepartmentEndpoint } from "constants/endpoints";

function* addDepartment(action) {
  const requestURL = `${createDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      name: action.name,
      safeAddress: action.safeAddress,
      createdBy: action.createdBy,
      payCycleDate: action.payCycleDate,
    }),
    headers: {
      "content-type": "application/json",
    },
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(addDepartmentError(result.log));
    } else {
      yield put(addDepartmentSuccess(result.departmentId, result.log));
    }
  } catch (err) {
    yield put(addDepartmentError(err));
  }
}

export default function* watchAddDepartment() {
  yield takeLatest(ADD_DEPARTMENT, addDepartment);
}
