import produce from "immer";
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  safeAddress: "",
  log: "",
  shouldRedirect: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_USER:
        draft.loading = true;
        draft.error = false;
        draft.safeAddress = "";
        draft.log = "";
        break;

      case LOGIN_USER_SUCCESS:
        draft.safeAddress = action.safeAddress;
        draft.log = action.log;
        draft.loading = false;
        draft.shouldRedirect = true;
        break;

      case LOGIN_USER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        draft.shouldRedirect = false;
        break;
    }
  });

export default reducer;
