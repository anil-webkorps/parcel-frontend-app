import {
  EDIT_TEAMMATE,
  EDIT_TEAMMATE_SUCCESS,
  EDIT_TEAMMATE_ERROR,
  DELETE_TEAMMATE,
  DELETE_TEAMMATE_SUCCESS,
  DELETE_TEAMMATE_ERROR,
} from "./action-types";

export function editTeammate({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  joiningDate,
  peopleId,
}) {
  return {
    type: EDIT_TEAMMATE,
    body: {
      encryptedEmployeeDetails,
      safeAddress,
      createdBy,
      departmentId,
      departmentName,
      joiningDate,
      peopleId,
    },
  };
}

export function editTeammateSuccess(log) {
  return {
    type: EDIT_TEAMMATE_SUCCESS,
    log,
  };
}

export function editTeammateError(error) {
  return {
    type: EDIT_TEAMMATE_ERROR,
    error,
  };
}

export function deleteTeammate(safeAddress, peopleId, departmentId = "") {
  return {
    type: DELETE_TEAMMATE,
    safeAddress,
    peopleId,
    departmentId,
  };
}

export function deleteTeammateSuccess(log) {
  return {
    type: DELETE_TEAMMATE_SUCCESS,
    log,
  };
}

export function deleteTeammateError(error) {
  return {
    type: DELETE_TEAMMATE_ERROR,
    error,
  };
}
