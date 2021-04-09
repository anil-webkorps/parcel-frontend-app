import { takeLatest, put, call, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import { DELETE_DEPARTMENT } from "./action-types";
import { deleteDepartmentError, deleteDepartmentSuccess } from "./actions";
import request from "utils/request";
import { deleteDepartmentEndpoint } from "constants/endpoints";

function* deleteDepartment(action) {
  const requestURL = `${deleteDepartmentEndpoint}`;
  const options = {
    method: "POST",
    body: JSON.stringify({
      departmentId: action.departmentId,
      safeAddress: action.safeAddress,
    }),
  };

  try {
    const result = yield call(request, requestURL, options);
    if (result.flag !== 200) {
      // Error in payload
      yield put(deleteDepartmentError(result.log));
    } else {
      yield put(deleteDepartmentSuccess(result.departmentId, result.log));
      yield put(push("/dashboard/people"));
    }
  } catch (err) {
    yield put(deleteDepartmentError(err));
  }
}

function* watchDeleteDepartment() {
  yield takeLatest(DELETE_DEPARTMENT, deleteDepartment);
}

export default function* modifyTeam() {
  yield fork(watchDeleteDepartment);
}
