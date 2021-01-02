import {
  SET_OWNER_ADDRESS,
  SET_OWNER_NAME,
  SET_OWNER_DETAILS,
} from "./action-types";

export function setOwnerName(name) {
  return {
    type: SET_OWNER_NAME,
    name,
  };
}

export function setOwnerAddress(address) {
  return {
    type: SET_OWNER_ADDRESS,
    address,
  };
}

export function setOwnerDetails(name, address, createdBy) {
  return {
    type: SET_OWNER_DETAILS,
    name,
    address, // safe address
    createdBy,
  };
}
