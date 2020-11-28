import {
  CHOOSE_STEP,
  UPDATE_FORM,
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
  ADD_TEAMMATE,
  ADD_TEAMMATE_SUCCESS,
  ADD_TEAMMATE_ERROR,
  CHOOSE_DEPARTMENT,
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
export function chooseDepartment({
  name,
  payCycleDate,
  departmentId,
  employees = 0,
}) {
  return {
    type: CHOOSE_DEPARTMENT,
    chosenDepartment: { name, payCycleDate, departmentId, employees },
  };
}

export function getDepartments(safeAddress) {
  return {
    type: GET_DEPARTMENTS,
    safeAddress,
  };
}

export function getDepartmentsSuccess(departments, log) {
  return {
    type: GET_DEPARTMENTS_SUCCESS,
    departments,
    log,
  };
}

export function getDepartmentsError(error) {
  return {
    type: GET_DEPARTMENTS_ERROR,
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
