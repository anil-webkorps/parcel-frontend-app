import {
  GET_OWNERS_AND_THRESHOLD,
  GET_OWNERS_AND_THRESHOLD_SUCCESS,
  GET_OWNERS_AND_THRESHOLD_ERROR,
  GET_NONCE,
  GET_NONCE_SUCCESS,
  GET_NONCE_ERROR,
} from "./action-types";

export function getOwnersAndThreshold(safeAddress) {
  return {
    type: GET_OWNERS_AND_THRESHOLD,
    safeAddress,
  };
}

export function getOwnersAndThresholdSuccess({ threshold, owners }) {
  return {
    type: GET_OWNERS_AND_THRESHOLD_SUCCESS,
    threshold,
    owners,
  };
}

export function getOwnersAndThresholdError(error) {
  return {
    type: GET_OWNERS_AND_THRESHOLD_ERROR,
    error,
  };
}

export function getNonce(safeAddress) {
  return {
    type: GET_NONCE,
    safeAddress,
  };
}

export function getNonceSuccess(count, countUniqueNonce) {
  return {
    type: GET_NONCE_SUCCESS,
    count,
    countUniqueNonce,
  };
}

export function getNonceError(error) {
  return {
    type: GET_NONCE_ERROR,
    error,
  };
}
