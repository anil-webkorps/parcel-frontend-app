import produce from "immer";
import {
  GET_ALL_TEAMMATES,
  GET_ALL_TEAMMATES_SUCCESS,
  GET_ALL_TEAMMATES_ERROR,
  GET_TEAMMATES_BY_DEPARTMENT,
  GET_TEAMMATES_BY_DEPARTMENT_SUCCESS,
  GET_TEAMMATES_BY_DEPARTMENT_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  teammates: undefined,
  departmentName: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_ALL_TEAMMATES:
      case GET_TEAMMATES_BY_DEPARTMENT:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_ALL_TEAMMATES_ERROR:
      case GET_TEAMMATES_BY_DEPARTMENT_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case GET_ALL_TEAMMATES_SUCCESS:
      case GET_TEAMMATES_BY_DEPARTMENT_SUCCESS:
        draft.loading = false;
        draft.teammates = action.teammates;
        draft.departmentName = action.departmentName || "";
        break;
    }
  });

export default reducer;
