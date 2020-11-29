import produce from "immer";
import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
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
  totalEmployees: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_DEPARTMENTS:
      case GET_DEPARTMENT_BY_ID:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_DEPARTMENTS_SUCCESS:
        draft.loading = false;
        draft.departments = action.departments;
        draft.totalEmployees = action.totalEmployees;
        break;

      case GET_DEPARTMENT_BY_ID_SUCCESS:
        draft.chosenDepartment = action.chosenDepartment;
        draft.loading = false;
        break;

      case GET_DEPARTMENTS_ERROR:
      case GET_DEPARTMENT_BY_ID_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
