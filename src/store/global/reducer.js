import produce from "immer";
import {
  SET_OWNER_NAME,
  SET_OWNER_ADDRESS,
  SET_OWNER_DETAILS,
} from "./action-types";

export const initialState = {
  ownerName: "",
  ownerSafeAddress: "",
  createdBy: "",
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_OWNER_NAME:
        draft.ownerName = action.name;
        break;

      case SET_OWNER_ADDRESS:
        draft.ownerSafeAddress = action.address;
        break;

      case SET_OWNER_DETAILS:
        draft.ownerName = action.name;
        draft.ownerSafeAddress = action.address;
        draft.createdBy = action.createdBy;
        break;
    }
  });

export default reducer;
