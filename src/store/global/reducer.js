import produce from "immer";
import {
  SET_OWNER_NAME,
  SET_OWNER_ADDRESS,
  SET_OWNER_DETAILS,
  SET_OWNERS_AND_THRESHOLD,
  CLEAR_GLOBAL_STATE,
  SET_ORGANISATION_TYPE,
} from "./action-types";

export const initialState = {
  ownerName: "",
  ownerSafeAddress: "",
  createdBy: "",
  owners: [], // [{name: "123", owner: "0x123"}]
  threshold: 0,
  organisationType: 0,
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

      case SET_OWNERS_AND_THRESHOLD:
        draft.owners = action.owners;
        draft.threshold = action.threshold;
        break;

      case SET_ORGANISATION_TYPE:
        draft.organisationType = action.organisationType;
        break;

      case CLEAR_GLOBAL_STATE:
        draft.ownerName = "";
        draft.ownerSafeAddress = "";
        draft.createdBy = "";
        draft.owners = [];
        draft.threshold = 0;
        break;
    }
  });

export default reducer;
