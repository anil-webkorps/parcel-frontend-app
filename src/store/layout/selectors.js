import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLayout = (state) => state.layout || initialState;

const makeSelectDropdown = () =>
  createSelector(selectLayout, (layoutState) => layoutState.dropdown);

export { selectLayout, makeSelectDropdown };
