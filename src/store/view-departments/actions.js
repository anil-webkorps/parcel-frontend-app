import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
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
