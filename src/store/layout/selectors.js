import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectLayout = (state) => state.layout || initialState;

const makeSelectIsNotificationOpen = () =>
  createSelector(selectLayout, (layoutState) => layoutState.isNotificationOpen);

export { selectLayout, makeSelectIsNotificationOpen };
