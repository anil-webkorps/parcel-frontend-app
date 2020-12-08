import {
  CHOOSE_STEP,
  UPDATE_FORM,
  ADD_TEAMMATE,
  SELECT_FLOW,
  ADD_TEAMMATE_SUCCESS,
  ADD_TEAMMATE_ERROR,
  CHOOSE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
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
  payCycleDate,
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
      payCycleDate,
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
