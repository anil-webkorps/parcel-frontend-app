import produce from "immer";
import {
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTIONS_SUCCESS,
  GET_MULTISIG_TRANSACTIONS_ERROR,
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
  SUBMIT_MULTISIG_TRANSACTION,
  SUBMIT_MULTISIG_TRANSACTION_SUCCESS,
  SUBMIT_MULTISIG_TRANSACTION_ERROR,
  CONFIRM_MULTISIG_TRANSACTION,
  CONFIRM_MULTISIG_TRANSACTION_SUCCESS,
  CONFIRM_MULTISIG_TRANSACTION_ERROR,
} from "./action-types";

export const initialState = {
  fetching: false,
  updating: false,
  transactions: [],
  log: "",
  error: false,
  success: false,
  transactionHash: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_MULTISIG_TRANSACTIONS:
        draft.fetching = true;
        draft.error = false;
        break;

      case GET_MULTISIG_TRANSACTIONS_SUCCESS:
        draft.fetching = false;
        draft.transactions = action.transactions;
        break;

      case GET_MULTISIG_TRANSACTIONS_ERROR:
        draft.fetching = false;
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

      case CONFIRM_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case CONFIRM_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case CONFIRM_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.success = false;
        break;

      case SUBMIT_MULTISIG_TRANSACTION:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case SUBMIT_MULTISIG_TRANSACTION_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.transactionHash = action.transactionHash;
        draft.success = true;
        break;

      case SUBMIT_MULTISIG_TRANSACTION_ERROR:
        draft.updating = false;
        draft.error = action.error;
        draft.success = false;
        break;
    }
  });

export default reducer;
