import produce from "immer";
import {
  GET_SAFE_BALANCES,
  GET_SAFE_BALANCES_SUCCESS,
  GET_SAFE_BALANCES_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  error: false,
  balances: [],
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_SAFE_BALANCES:
        draft.loading = true;
        draft.error = false;
        draft.balances = null;
        break;

      case GET_SAFE_BALANCES_SUCCESS:
        draft.balances = action.balances;
        draft.loading = false;
        break;

      case GET_SAFE_BALANCES_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
    }
  });

export default reducer;
