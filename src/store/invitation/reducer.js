import produce from "immer";
import {
  GET_INVITATIONS,
  GET_INVITATIONS_SUCCESS,
  GET_INVITATIONS_ERROR,
} from "./action-types";

export const initialState = {
  loading: false,
  owners: [],
  error: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_INVITATIONS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_INVITATIONS_SUCCESS:
        draft.loading = false;
        draft.owners = action.owners;
        break;

      case GET_INVITATIONS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;
    }
  });

export default reducer;
