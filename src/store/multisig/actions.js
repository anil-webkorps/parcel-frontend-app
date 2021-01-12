import {
  CREATE_MULTISIG_TRANSACTION,
  CREATE_MULTISIG_TRANSACTION_SUCCESS,
  CREATE_MULTISIG_TRANSACTION_ERROR,
  GET_MULTISIG_TRANSACTIONS,
  GET_MULTISIG_TRANSACTIONS_SUCCESS,
  GET_MULTISIG_TRANSACTIONS_ERROR,
} from "./action-types";

export function getMultisigTransactions(safeAddress) {
  return {
    type: GET_MULTISIG_TRANSACTIONS,
    safeAddress,
  };
}

export function getMultisigTransactionsSuccess(transactions) {
  return {
    type: GET_MULTISIG_TRANSACTIONS_SUCCESS,
    transactions,
  };
}

export function getMultisigTransactionsError(error) {
  return {
    type: GET_MULTISIG_TRANSACTIONS_ERROR,
    error,
  };
}

export function createMultisigTransaction(body) {
  return {
    type: CREATE_MULTISIG_TRANSACTION,
    body,
  };
}

export function createMultisigTransactionSuccess(transactionId, log) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_SUCCESS,
    transactionId,
    log,
  };
}

export function createMultisigTransactionError(error) {
  return {
    type: CREATE_MULTISIG_TRANSACTION_ERROR,
    error,
  };
}
