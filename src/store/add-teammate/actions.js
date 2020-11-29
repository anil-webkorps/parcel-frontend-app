import {
  CHOOSE_STEP,
  UPDATE_FORM,
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
