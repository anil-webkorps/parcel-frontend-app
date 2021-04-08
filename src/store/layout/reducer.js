import produce from "immer";
import { TOGGLE_NOTIFICATION } from "./action-types";

export const initialState = {
  dropdown: {}, // { SETTINGS: true, CURRENCY: false, ... }
  isNotificationOpen: false,
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case TOGGLE_NOTIFICATION:
        draft.isNotificationOpen = action.show;
        break;
    }
  });

export default reducer;
