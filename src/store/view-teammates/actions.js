import {
  GET_ALL_TEAMMATES,
  GET_ALL_TEAMMATES_SUCCESS,
  GET_ALL_TEAMMATES_ERROR,
  GET_TEAMMATES_BY_DEPARTMENT,
  GET_TEAMMATES_BY_DEPARTMENT_SUCCESS,
  GET_TEAMMATES_BY_DEPARTMENT_ERROR,
} from "./action-types";

export function getAllTeammates(safeAddress) {
  return {
    type: GET_ALL_TEAMMATES,
    safeAddress,
  };
}

export function getAllTeammatesSuccess(teammates) {
  return {
    type: GET_ALL_TEAMMATES_SUCCESS,
    teammates,
  };
}

export function getAllTeammatesError(error) {
  return {
    type: GET_ALL_TEAMMATES_ERROR,
    error,
  };
}

export function getTeammatesByDepartment(safeAddress, departmentId) {
  return {
    type: GET_TEAMMATES_BY_DEPARTMENT,
    safeAddress,
    departmentId,
  };
}

export function getTeammatesByDepartmentSuccess(teammates, departmentName) {
  return {
    type: GET_TEAMMATES_BY_DEPARTMENT_SUCCESS,
    teammates,
    departmentName,
  };
}

export function getTeammatesByDepartmentError(error) {
  return {
    type: GET_TEAMMATES_BY_DEPARTMENT_ERROR,
    error,
  };
}
