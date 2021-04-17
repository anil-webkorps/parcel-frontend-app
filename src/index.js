/**
 * index.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import localForage from "localforage";

import { Web3ReactProvider } from "@web3-react/core";
import { persistStore } from "redux-persist";
import history from "utils/history";
import getLibrary from "utils/getLibrary";
// import Web3ReactManager from "components/hoc/Web3ReactManager";
import App from "./pages/App";
import configureStore from "store/index";

const initialState = {};
const store = configureStore(initialState, history);

// Config for redux-persist
const persistConfig = {
  key: "root",
  storage: localForage,
  // NOTE: ONLY KEEP MOST IMP DATA HERE
  whitelist: ["global"], // global state will pe persisted
};
window.persistor = persistStore(store, persistConfig);

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      {/* <Web3ReactManager> */}
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
      {/* </Web3ReactManager> */}
    </Web3ReactProvider>
  </Provider>,
  document.querySelector("#root")
);
