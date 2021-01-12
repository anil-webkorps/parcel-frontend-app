import { createSelector } from "reselect";
import { initialState } from "./reducer";

const selectMultisig = (state) => state.multisig || initialState;

const makeSelectLoading = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.loading);

const makeSelectMultisigTransactions = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.transactions);

const makeSelectSuccess = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.success);

const makeSelectUpdating = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.updating);

const makeSelectError = () =>
  createSelector(selectMultisig, (multisigState) => multisigState.error);

export {
  selectMultisig,
  makeSelectMultisigTransactions,
  makeSelectLoading,
  makeSelectSuccess,
  makeSelectUpdating,
  makeSelectError,
};
