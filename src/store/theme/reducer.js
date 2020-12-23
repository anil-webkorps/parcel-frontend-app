import { TOGGLE_THEME } from "./action-types";

const INITIAL_STATE = {
  isDarkMode: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_THEME: {
      return { ...state, isDarkMode: !state.isDarkMode };
    }

    default:
      return state;
  }
};

export default reducer;
