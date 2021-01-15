import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectMultisig = (state) => state.multisig || initialState;

const makeSelectFetching = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.fetching);

const makeSelectMultisigTransactions = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.transactions);

const makeSelectSuccess = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.success);

const makeSelectMultisigTransactionHash = () =>
  createSelector(
    selectMultisig,
    (multisigState) => multisigState.transactionHash
  );

const makeSelectUpdating = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.updating);

const makeSelectError = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.error);

export {
  selectMultisig,
  makeSelectMultisigTransactions,
  makeSelectFetching,
  makeSelectMultisigTransactionHash,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectError,
};
