import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLayout = (state) => state.layout || initialState;

const makeSelectDropdown = () =>
  createSelector(selectLayout, (layoutState) => layoutState.dropdown);

const makeSelectIsNotificationOpen = () =>
  createSelector(selectLayout, (layoutState) => layoutState.isNotificationOpen);

export { selectLayout, makeSelectDropdown, makeSelectIsNotificationOpen };
