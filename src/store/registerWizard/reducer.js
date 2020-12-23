import produce from "immer";
import { CHOOSE_STEP, UPDATE_FORM } from "./action-types";

export const initialState = {
  step: 0,
  form: {},
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
    }
  });

export default reducer;
