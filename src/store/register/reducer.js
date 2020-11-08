import produce from "immer";
import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  transactionHash: "",
  log: "",
  shouldRedirect: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REGISTER_USER:
        draft.loading = true;
        draft.error = false;
        draft.transactionHash = "";
        draft.log = "";
        break;

      case REGISTER_USER_SUCCESS:
        draft.transactionHash = action.transactionHash;
        draft.log = action.log;
        draft.loading = false;
        draft.shouldRedirect = true;
        break;

      case REGISTER_USER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default reducer;
