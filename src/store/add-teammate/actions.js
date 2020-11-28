import {
  CHOOSE_STEP,
  UPDATE_FORM,
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
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
export function chooseDepartment(name, payCycleDate) {
  return {
    type: CHOOSE_DEPARTMENT,
    name,
    payCycleDate,
  };
}

export function getDepartments() {
  return {
    type: GET_DEPARTMENTS,
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

export function addTeammate() {
  return {
    type: ADD_TEAMMATE,
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
