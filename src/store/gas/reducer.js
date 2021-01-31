import produce from "immer";
import {
  GET_GAS_PRICE,
  GET_GAS_PRICE_SUCCESS,
  GET_GAS_PRICE_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  slow: 0,
  average: 0,
  fast: 0,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_GAS_PRICE:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_GAS_PRICE_SUCCESS:
        draft.loading = false;
        draft.slow = action.slow;
        draft.average = action.average;
        draft.fast = action.fast;
        break;

      case GET_GAS_PRICE_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
