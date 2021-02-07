import {
  UPDATE_FORM,
  ADD_DEPARTMENT,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_ERROR,
} from "./action-types";

export function updateForm(formData) {
  return {
    type: UPDATE_FORM,
    formData,
  };
}

export function addDepartment({ name, safeAddress, createdBy }) {
  return {
    type: ADD_DEPARTMENT,
    name,
    safeAddress,
    createdBy,
  };
}

export function addDepartmentSuccess(departmentId, log) {
  return {
    type: ADD_DEPARTMENT_SUCCESS,
    departmentId,
    log,
  };
}

export function addDepartmentError(error) {
  return {
    type: ADD_DEPARTMENT_ERROR,
    error,
  };
}
