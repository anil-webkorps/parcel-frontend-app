import produce from "immer";
import {
  CHOOSE_STEP,
  UPDATE_FORM,
  GET_SAFES,
  GET_SAFES_SUCCESS,
  GET_SAFES_ERROR,
} from "./action-types";

export const initialState = {
  step: 1,
  form: {},
  loading: false,
  safes: [],
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CHOOSE_STEP:
        draft.step = action.step;
        break;

      case UPDATE_FORM:
        draft.form = { ...draft.form, ...action.formData };
        break;

      case GET_SAFES:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_SAFES_SUCCESS:
        draft.loading = false;
        draft.safes = action.safes;
        break;

      case GET_SAFES_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
