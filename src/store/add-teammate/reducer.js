import produce from "immer";
import {
  CHOOSE_STEP,
  UPDATE_FORM,
  SELECT_FLOW,
  ADD_TEAMMATE,
  ADD_TEAMMATE_ERROR,
  ADD_TEAMMATE_SUCCESS,
  ADD_BULK_TEAMMATE,
  ADD_BULK_TEAMMATE_ERROR,
  ADD_BULK_TEAMMATE_SUCCESS,
  CHOOSE_DEPARTMENT,
  GET_DEPARTMENT_BY_ID,
  GET_DEPARTMENT_BY_ID_SUCCESS,
  GET_DEPARTMENT_BY_ID_ERROR,
  EDIT_TEAMMATE,
  EDIT_TEAMMATE_SUCCESS,
  EDIT_TEAMMATE_ERROR,
  DELETE_TEAMMATE,
  DELETE_TEAMMATE_SUCCESS,
  DELETE_TEAMMATE_ERROR,
  SET_PEOPLE_ID,
} from "./action-types";

export const initialState = {
  step: 0,
  form: {},
  loading: false,
  departments: [],
  error: false,
  chosenDepartment: null,
  totalEmployees: 0,
  flow: "", // SINGLE or BULK,
  success: false,
  updating: false,
  peopleId: "",
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

      case SELECT_FLOW:
        draft.flow = action.flow;
        break;

      case CHOOSE_DEPARTMENT:
        draft.chosenDepartment = action.chosenDepartment;
        break;

      case ADD_TEAMMATE:
      case ADD_BULK_TEAMMATE:
      case GET_DEPARTMENT_BY_ID:
        draft.loading = true;
        draft.error = false;
        draft.success = false;
        break;

      case ADD_TEAMMATE_ERROR:
      case ADD_BULK_TEAMMATE_ERROR:
      case GET_DEPARTMENT_BY_ID_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_TEAMMATE_SUCCESS:
        draft.loading = false;
        break;

      case ADD_BULK_TEAMMATE_SUCCESS:
        draft.loading = false;
        draft.success = true;
        break;

      case GET_DEPARTMENT_BY_ID_SUCCESS:
        draft.chosenDepartment = action.chosenDepartment;
        draft.loading = false;
        break;

      case EDIT_TEAMMATE:
      case DELETE_TEAMMATE:
        draft.updating = true;
        break;

      case EDIT_TEAMMATE_SUCCESS:
      case DELETE_TEAMMATE_SUCCESS:
        draft.updating = false;
        break;

      case EDIT_TEAMMATE_ERROR:
      case DELETE_TEAMMATE_ERROR:
        draft.updating = false;
        break;

      case SET_PEOPLE_ID:
        draft.peopleId = action.peopleId;
        break;
    }
  });

export default reducer;
