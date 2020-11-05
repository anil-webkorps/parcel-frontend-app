/**
 * Test injectors
 */

import React from "react";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";

import configureStore from "store/index";
import { useInjectReducer } from "../injectReducer";
import * as reducerInjectors from "../reducerInjectors";

const reducer = (s) => s;

describe("useInjectReducer hook", () => {
  let store;
  let injectors;
  let ComponentWithReducer;

  beforeAll(() => {
    injectors = {
      injectReducer: jest.fn(),
    };
    reducerInjectors.default = jest.fn().mockImplementation(() => injectors);
    store = configureStore({});
    ComponentWithReducer = () => {
      useInjectReducer({ key: "test", reducer });
      return null;
    };
  });

  it("should inject a given reducer", () => {
    render(
      <Provider store={store}>
        <ComponentWithReducer />
      </Provider>
    );

    console.debug({ injectors });

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1);
    expect(injectors.injectReducer).toHaveBeenCalledWith("test", reducer);
  });
});
