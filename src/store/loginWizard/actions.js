import {
  CHOOSE_STEP,
  UPDATE_FORM,
  SELECT_FLOW,
  CHOOSE_SAFE,
  GET_SAFES,
  GET_SAFES_SUCCESS,
  GET_SAFES_ERROR,
  FETCH_SAFES,
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

export function chooseSafe(safeAddress) {
  return {
    type: CHOOSE_SAFE,
    safeAddress,
  };
}

export function fetchSafes(owner) {
  return {
    type: FETCH_SAFES,
    owner,
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
