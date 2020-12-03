import produce from "immer";
import {
  GET_DEPARTMENTS,
  GET_DEPARTMENTS_SUCCESS,
  GET_DEPARTMENTS_ERROR,
} from "./action-types";

export const initialState = {
  step: 0,
  form: {},
  loading: false,
  departments: undefined,
  error: false,
  totalEmployees: 0,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_DEPARTMENTS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_DEPARTMENTS_SUCCESS:
        draft.loading = false;
        draft.departments = action.departments;
        draft.totalEmployees = action.totalEmployees;
        break;

      case GET_DEPARTMENTS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
