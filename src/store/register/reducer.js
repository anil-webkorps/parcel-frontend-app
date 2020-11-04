/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can
 * update our application state. To add a new action,
 * add it to the switch statement in the reducer function
 *
 */

import produce from "immer";
import {
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
} from "./action-types";

// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  transactionHash: "",
  log: "",
};

/* eslint-disable default-case, no-param-reassign */
const registerReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REGISTER_USER:
        // Delete prefixed '@' from the github username
        draft.loading = true;
        draft.error = false;
        draft.transactionHash = "";
        draft.log = "";
        break;

      case REGISTER_USER_SUCCESS:
        draft.transactionHash = action.transactionHash;
        draft.log = action.log;
        draft.loading = false;
        break;

      case REGISTER_USER_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default registerReducer;
