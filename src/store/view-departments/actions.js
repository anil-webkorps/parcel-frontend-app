import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
} from "./action-types";

export function getDepartments(safeAddress) {
  return {
    type: GET_DEPARTMENTS,
    safeAddress,
  };
}

export function getDepartmentsSuccess(departments, totalEmployees, log) {
  return {
    type: GET_DEPARTMENTS_SUCCESS,
    departments,
    totalEmployees,
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
