import {
  CHOOSE_STEP,
  UPDATE_FORM,
  GET_SAFES,
  GET_SAFES_SUCCESS,
  GET_SAFES_ERROR,
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

export function getSafes(owner) {
  return {
    type: GET_SAFES,
    owner,
  };
}

export function getSafesSuccess(safes, log) {
  return {
    type: GET_SAFES_SUCCESS,
    safes,
    log,
  };
}

export function getSafesError(error) {
  return {
    type: GET_SAFES_ERROR,
    error,
  };
}
