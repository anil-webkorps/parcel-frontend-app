import {
  CHOOSE_STEP,
  UPDATE_FORM,
  SELECT_FLOW,
  ADD_TEAMMATE,
  ADD_TEAMMATE_SUCCESS,
  ADD_TEAMMATE_ERROR,
  ADD_BULK_TEAMMATE,
  ADD_BULK_TEAMMATE_SUCCESS,
  ADD_BULK_TEAMMATE_ERROR,
  CHOOSE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
  EDIT_TEAMMATE,
  EDIT_TEAMMATE_SUCCESS,
  EDIT_TEAMMATE_ERROR,
  DELETE_TEAMMATE,
  DELETE_TEAMMATE_SUCCESS,
  DELETE_TEAMMATE_ERROR,
} from "./action-types";

export function chooseStep(step) {
  return {
    type: CHOOSE_STEP,
    step,
  };
}

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function selectFlow(flow) {
  return {
    type: SELECT_FLOW,
    flow,
  };
}

export function chooseDepartment(chosenDepartment) {
  return {
    type: CHOOSE_DEPARTMENT,
    chosenDepartment,
  };
}

export function addTeammate({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  joiningDate,
}) {
  return {
    type: ADD_TEAMMATE,
    body: {
      encryptedEmployeeDetails,
      safeAddress,
      createdBy,
      departmentId,
      departmentName,
      joiningDate,
    },
  };
}

export function addTeammateSuccess() {
  return {
    type: ADD_TEAMMATE_SUCCESS,
  };
}

export function addTeammateError(error) {
  return {
    type: ADD_TEAMMATE_ERROR,
    error,
  };
}

export function addBulkTeammates({ safeAddress, createdBy, data }) {
  return {
    type: ADD_BULK_TEAMMATE,
    createdBy,
    safeAddress,
    data,
  };
}

export function addBulkTeammatesSuccess() {
  return {
    type: ADD_BULK_TEAMMATE_SUCCESS,
  };
}

export function addBulkTeammatesError(error) {
  return {
    type: ADD_BULK_TEAMMATE_ERROR,
    error,
  };
}

export function getDepartmentById(safeAddress, departmentId) {
  return {
    type: GET_DEPARTMENT_BY_ID,
    safeAddress,
    departmentId,
  };
}

export function getDepartmentByIdSuccess(chosenDepartment, log) {
  return {
    type: GET_DEPARTMENT_BY_ID_SUCCESS,
    chosenDepartment,
    log,
  };
}

export function getDepartmentByIdError(error) {
  return {
    type: GET_DEPARTMENT_BY_ID_ERROR,
    error,
  };
}

export function editTeammate({
  encryptedEmployeeDetails,
  safeAddress,
  createdBy,
  departmentId,
  departmentName,
  joiningDate,
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

export function deleteTeammate(safeAddress, peopleId) {
  return {
    type: DELETE_TEAMMATE,
    safeAddress,
    peopleId,
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
