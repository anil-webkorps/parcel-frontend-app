import produce from "immer";
import {
  CHOOSE_STEP,
  UPDATE_FORM,
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
  ADD_TEAMMATE,
  ADD_TEAMMATE_ERROR,
  ADD_TEAMMATE_SUCCESS,
  CHOOSE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
} from "./action-types";

export const initialState = {
  step: 0,
  form: {},
  loading: false,
  departments: [],
  error: false,
  chosenDepartment: null,
  payCycleDate: "",
  totalEmployees: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHOOSE_STEP:
        draft.step = action.step;
        break;

      case UPDATE_FORM:
        if (action.formData) draft.form = { ...draft.form, ...action.formData };
        else draft.form = {};
        break;

      case CHOOSE_DEPARTMENT:
        draft.chosenDepartment = action.chosenDepartment;
        draft.payCycleDate = action.payCycleDate;
        break;

      case GET_DEPARTMENTS:
      case ADD_TEAMMATE:
      case GET_DEPARTMENT_BY_ID:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_DEPARTMENTS_SUCCESS:
        draft.loading = false;
        draft.departments = action.departments;
        draft.totalEmployees = action.totalEmployees;
        break;

      case GET_DEPARTMENTS_ERROR:
      case ADD_TEAMMATE_ERROR:
      case GET_DEPARTMENT_BY_ID_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_TEAMMATE_SUCCESS:
        draft.loading = false;
        break;

      case GET_DEPARTMENT_BY_ID_SUCCESS:
        draft.chosenDepartment = action.chosenDepartment;
        draft.loading = false;
        break;
    }
  });

export default reducer;
