/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localstorage
import globalReducer from "./global/reducer";
import themeReducer from "./theme/reducer";
import history from "utils/history";

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  // NOTE: ONLY KEEP MOST IMP DATA HERE
  whitelist: ["global"], // global state will pe persisted
};
/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    global: globalReducer,
    router: connectRouter(history),
    theme: themeReducer,
    ...injectedReducers,
  });

  return persistReducer(persistConfig, rootReducer);
}
