import produce from "immer";
import {
  ADD_TRANSACTION,
  ADD_TRANSACTION_ERROR,
  ADD_TRANSACTION_SUCCESS,
  VIEW_TRANSACTIONS,
  VIEW_TRANSACTIONS_ERROR,
  VIEW_TRANSACTIONS_SUCCESS,
  CLEAR_TRANSACTION_HASH,
} from "./action-types";

export const initialState = {
  transactions: undefined,
  metaTransactionHash: "",
  log: "",
  errorInFetch: false,
  fetching: false,
  loading: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_TRANSACTION:
        draft.loading = true;
        draft.error = false;
        break;

      case ADD_TRANSACTION_SUCCESS:
        draft.loading = false;
        draft.log = action.log;
        draft.metaTransactionHash = action.metaTransactionHash;
        break;

      case ADD_TRANSACTION_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case VIEW_TRANSACTIONS:
        draft.fetching = true;
        draft.error = false;
        break;

      case VIEW_TRANSACTIONS_SUCCESS:
        draft.fetching = false;
        draft.transactions = action.transactions;
        draft.log = action.log;
        break;

      case VIEW_TRANSACTIONS_ERROR:
        draft.errorInFetch = action.errorInFetch;
        draft.fetching = false;
        break;

      case CLEAR_TRANSACTION_HASH:
        draft.metaTransactionHash = "";
        break;
    }
  });

export default reducer;
