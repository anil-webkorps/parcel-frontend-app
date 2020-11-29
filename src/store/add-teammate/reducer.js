import produce from "immer";
import {
  CHOOSE_STEP,
  UPDATE_FORM,
  ADD_TEAMMATE,
  ADD_TEAMMATE_ERROR,
  ADD_TEAMMATE_SUCCESS,
  CHOOSE_DEPARTMENT,
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

      case ADD_TEAMMATE:
        draft.loading = true;
        draft.error = false;
        break;

      case ADD_TEAMMATE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_TEAMMATE_SUCCESS:
        draft.loading = false;
        break;
    }
  });

export default reducer;
