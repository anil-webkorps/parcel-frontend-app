import produce from "immer";
import {
  GET_SAFE_DETAILS,
  GET_SAFE_DETAILS_SUCCESS,
  GET_SAFE_DETAILS_ERROR,
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  updating: false,
  nonce: undefined,
  threshold: undefined,
  owners: [],
  error: false,
  success: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_SAFE_DETAILS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_SAFE_DETAILS_SUCCESS:
        draft.loading = false;
        draft.nonce = action.nonce;
        draft.threshold = action.threshold;
        draft.owners = action.owners;
        break;

      case GET_SAFE_DETAILS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case CREATE_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.error = false;
        break;

      case CREATE_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.success = action.success;
        break;

      case CREATE_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
