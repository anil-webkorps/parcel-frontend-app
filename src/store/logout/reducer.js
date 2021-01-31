import produce from "immer";
import { LOGOUT_USER } from "./action-types";

export const initialState = {
  loggedIn: false,
  token: undefined,
  currentUser: undefined,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LOGOUT_USER:
        draft.loggedIn = false;
        draft.token = undefined;
        draft.currentUser = undefined;
        break;
    }
  });

export default reducer;
