import produce from "immer";
import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  IMPORT_SAFE,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  safeAddress: "",
  log: "",
  flag: 0,
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
        draft.flag = 0;
        break;

      case LOGIN_USER_SUCCESS:
        draft.safeAddress = action.safeAddress;
        draft.log = action.log;
        draft.loading = false;
        break;

      case LOGIN_USER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case IMPORT_SAFE:
        draft.flag = action.flag;
        draft.loading = false;
        break;
    }
  });

export default reducer;
