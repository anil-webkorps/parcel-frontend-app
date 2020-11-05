/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";

// import globalReducer from "./global/reducer";
import themeReducer from "./theme/reducer";

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    // global: globalReducer,
    theme: themeReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
