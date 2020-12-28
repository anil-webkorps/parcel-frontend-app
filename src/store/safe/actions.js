import {
  GET_SAFE_DETAILS,
  GET_SAFE_DETAILS_SUCCESS,
  GET_SAFE_DETAILS_ERROR,
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
  GET_MULTISIG_TRANSACTION,
  GET_MULTISIG_TRANSACTION_SUCCESS,
  GET_MULTISIG_TRANSACTION_ERROR,
} from "./action-types";

export function getSafeDetails(safeAddress) {
  return {
    type: GET_SAFE_DETAILS,
    safeAddress,
  };
}

export function getSafeDetailsSuccess({ threshold, owners, nonce }) {
  return {
    type: GET_SAFE_DETAILS_SUCCESS,
    threshold,
    owners,
    nonce,
  };
}

export function getSafeDetailsError(error) {
  return {
    type: GET_SAFE_DETAILS_ERROR,
    error,
  };
}

export function getMultisigTransaction(safeAddress) {
  return {
    type: GET_MULTISIG_TRANSACTION,
    safeAddress,
  };
}

export function getMultisigTransactionSuccess({
  confirmations,
  dataDecoded,
  executionDate,
  executor,
  isExecuted,
  isSuccessful,
  nonce,
  safeTxHash,
  submissionDate,
  to,
  transactionHash,
}) {
  return {
    type: GET_MULTISIG_TRANSACTION_SUCCESS,
    confirmations,
    dataDecoded,
    executionDate,
    executor,
    isExecuted,
    isSuccessful,
    nonce,
    safeTxHash,
    submissionDate,
    to,
    transactionHash,
  };
}

export function getMultisigTransactionError(error) {
  return {
    type: GET_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}

export function createMultisigTransaction({
  safeAddress,
  to,
  value,
  data,
  operation,
  gasToken,
  safeTxGas,
  baseGas,
  gasPrice,
  refundReceiver,
  nonce,
  contractTransactionHash,
  sender,
  signature,
  origin,
}) {
  return {
    type: CREATE_MULTISIG_TRANSACTION,
    safeAddress,
    to,
    value,
    data,
    operation,
    gasToken,
    safeTxGas,
    baseGas,
    gasPrice,
    refundReceiver,
    nonce,
    contractTransactionHash,
    sender,
    signature,
    origin,
  };
}

export function createMultisigTransactionSuccess(success) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_SUCCESS,
    success,
  };
}

export function createMultisigTransactionError(error) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}
