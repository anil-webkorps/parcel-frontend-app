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

export function addDepartment() {
  return {
    type: ADD_DEPARTMENT,
  };
}

export function addDepartmentSuccess() {
  return {
    type: ADD_DEPARTMENT_SUCCESS,
  };
}

export function addDepartmentError(error) {
  return {
    type: ADD_DEPARTMENT_ERROR,
    error,
  };
}
