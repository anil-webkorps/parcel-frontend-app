import produce from "immer";
import {
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTIONS_SUCCESS,
  GET_MULTISIG_TRANSACTIONS_ERROR,
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  updating: false,
  transactions: [],
  log: "",
  error: false,
  success: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_MULTISIG_TRANSACTIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_MULTISIG_TRANSACTIONS_SUCCESS:
        draft.loading = false;
        draft.transactions = action.transactions;
        break;

      case GET_MULTISIG_TRANSACTIONS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case CREATE_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case CREATE_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case CREATE_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.success = false;
        break;
    }
  });

export default reducer;
