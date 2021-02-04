import produce from "immer";
import {
  GET_TOKENS,
  GET_TOKENS_ERROR,
  GET_TOKENS_SUCCESS,
  ADD_CUSTOM_TOKEN,
  ADD_CUSTOM_TOKEN_ERROR,
  ADD_CUSTOM_TOKEN_SUCCESS,
} from "./action-types";

export const initialState = {
  tokens: undefined,
  log: "",
  loading: false,
  updating: false,
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_TOKENS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_TOKENS_SUCCESS:
        draft.loading = false;
        draft.log = action.log;
        draft.tokens = action.tokens;
        break;

      case GET_TOKENS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_CUSTOM_TOKEN:
        draft.updating = true;
        draft.error = false;
        break;

      case ADD_CUSTOM_TOKEN_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        break;

      case ADD_CUSTOM_TOKEN_ERROR:
        draft.errorInFetch = action.errorInFetch;
        draft.updating = false;
        break;
    }
  });

export default reducer;
