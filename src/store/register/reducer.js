import produce from "immer";
import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  CREATE_META_TX,
  CREATE_META_TX_SUCCESS,
  CREATE_META_TX_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  transactionHash: "",
  log: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REGISTER_USER:
      case CREATE_META_TX:
        draft.loading = true;
        draft.error = false;
        draft.transactionHash = "";
        draft.log = "";
        break;

      case REGISTER_USER_SUCCESS:
      case CREATE_META_TX_SUCCESS:
        draft.transactionHash = action.transactionHash;
        draft.log = action.log;
        draft.loading = false;
        break;

      case REGISTER_USER_ERROR:
      case CREATE_META_TX_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default reducer;
