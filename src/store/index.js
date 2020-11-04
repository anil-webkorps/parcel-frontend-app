import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import theme from "./theme/reducer";

export const rootReducer = combineReducers({
  theme,
});

export default function configureStore(initialState = {}) {
  let composeEnhancers = compose;
  let reduxSagaMonitorOptions = {};

  // If Redux Dev Tools and Saga Dev Tools Extensions are installed, enable them
  /* istanbul ignore next */
  if (process.env.NODE_ENV !== "production" && typeof window === "object") {
    /* eslint-disable no-underscore-dangle */
    if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
      composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});

    // NOTE: Uncomment the code below to restore support for Redux Saga
    // Dev Tools once it supports redux-saga version 1.x.x
    if (window.__SAGA_MONITOR_EXTENSION__)
      reduxSagaMonitorOptions = {
        sagaMonitor: window.__SAGA_MONITOR_EXTENSION__,
      };
    /* eslint-enable */
  }
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

  const middlewares = [sagaMiddleware];
  const enhancers = [applyMiddleware(...middlewares)];

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(...enhancers)
  );
  store.runSaga = sagaMiddleware.run;
  store.injectedSagas = {}; // Saga registry
  return store;
}
