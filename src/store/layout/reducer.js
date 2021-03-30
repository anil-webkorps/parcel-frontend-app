import produce from "immer";
import { TOGGLE_DROPDOWN } from "./action-types";

export const initialState = {
  dropdown: {}, // { SETTINGS: true, CURRENCY: false, ... }
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case TOGGLE_DROPDOWN:
        // on opening any one dropdown, close all the others
        if (!state.dropdown[action.dropdownName]) {
          draft.dropdown[action.dropdownName] = action.show;
        }
        draft.dropdown = Object.keys(draft.dropdown).reduce((acc, key) => {
          if (key === action.dropdownName)
            return { ...acc, [key]: action.show };
          return { ...acc, [key]: false };
        }, {});
        break;
    }
  });

export default reducer;
