import {
  ADD_TRANSACTION,
  ADD_TRANSACTION_SUCCESS,
  ADD_TRANSACTION_ERROR,
  VIEW_TRANSACTIONS,
  VIEW_TRANSACTIONS_SUCCESS,
  VIEW_TRANSACTIONS_ERROR,
} from "./action-types";

export function addTransaction({
  to,
  safeAddress,
  createdBy,
  transactionHash,
  txData,
  tokenValue,
  tokenCurrency,
  fiatValue,
  addresses,
  fiatCurrency = "USD",
  transactionMode = 0, // 0 = mass payout, 1 = quick transfer
}) {
  return {
    type: ADD_TRANSACTION,
    body: {
      to,
      safeAddress,
      createdBy,
      transactionHash,
      txData,
      tokenValue,
      tokenCurrency,
      fiatValue,
      addresses,
      fiatCurrency,
      transactionMode,
    },
  };
}

export function addTransactionSuccess(log) {
  return {
    type: ADD_TRANSACTION_SUCCESS,
    log,
  };
}

export function addTransactionError(error) {
  return {
    type: ADD_TRANSACTION_ERROR,
    error,
  };
}

export function viewTransactions(safeAddress) {
  return {
    type: VIEW_TRANSACTIONS,
    safeAddress,
  };
}

export function viewTransactionsSuccess(transactions, log) {
  return {
    type: VIEW_TRANSACTIONS_SUCCESS,
    transactions,
    log,
  };
}

export function viewTransactionsError(error) {
  return {
    type: VIEW_TRANSACTIONS_ERROR,
    error,
  };
}
