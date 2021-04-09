import produce from "immer";
import {
  EDIT_TEAMMATE,
  EDIT_TEAMMATE_SUCCESS,
  EDIT_TEAMMATE_ERROR,
  DELETE_TEAMMATE,
  DELETE_TEAMMATE_SUCCESS,
  DELETE_TEAMMATE_ERROR,
} from "./action-types";

export const initialState = {
  error: false,
  updating: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
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
        draft.error = action.error;
        break;
    }
  });

export default reducer;
