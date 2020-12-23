import produce from "immer";
import {
  GET_MARKET_RATES,
  GET_MARKET_RATES_SUCCESS,
  GET_MARKET_RATES_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  prices: null,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_MARKET_RATES:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_MARKET_RATES_SUCCESS:
        draft.loading = false;
        draft.prices = action.prices;
        break;

      case GET_MARKET_RATES_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
