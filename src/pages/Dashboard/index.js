import React, { useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";

import Dashboard from "components/Dashboard";
import People from "components/People";
import AddTeammate from "components/People/AddTeammate";
import AddDepartment from "components/People/AddDepartment";
import ViewTeammates from "components/People/ViewTeammates";
import Payments from "components/Payments";
import Transactions from "components/Transactions";
import AccountSummary from "components/AccountSummary";
import MultiSigTransactions from "components/Transactions/MultiSigTransactions";
import MultiSigTransactionDetails from "components/Transactions/MultiSigTransactionDetails";
import TransactionDetails from "components/Transactions/TransactionDetails";
import QuickTransfer from "components/QuickTransfer";
import InviteOwners from "components/InviteOwners";
import Authenticated from "components/hoc/Authenticated";
import NotFoundPage from "pages/NotFound";
import {
  makeSelectIsMultiOwner,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { networkId } from "constants/networks";
import { ROOT_BE_URL } from "constants/endpoints";
import { showToast, ToastMessage } from "components/common/Toast";
import { getTransactionByIdSuccess } from "store/transactions/actions";
import { getMultisigTransactionByIdSuccess } from "store/multisig/actions";
import Button from "components/common/Button";

const DashboardPage = ({ match }) => {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  const socketRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    if (safeAddress) {
      socketRef.current = io.connect(ROOT_BE_URL);

      socketRef.current.on(
        `${safeAddress}_${networkId}_txConfirmed`,
        (message) => {
          if (message) {
            if (!isMultiOwner) {
              showToast(
                <div>
                  <div>Transaction Confirmed</div>
                  <Button
                    iconOnly
                    to={`/dashboard/transactions/${message.transaction[0].transactionId}`}
                  >
                    View
                  </Button>
                </div>
              );
              dispatch(
                getTransactionByIdSuccess(message.transaction[0], message.log)
              );
            } else {
              showToast(
                <div>
                  <div>Transaction Confirmed</div>
                  <Button
                    iconOnly
                    to={`/dashboard/transactions/${message.transaction.txDetails.transactionId}`}
                  >
                    View
                  </Button>
                </div>
              );
              dispatch(
                getMultisigTransactionByIdSuccess(
                  message.transaction,
                  message.executionAllowed
                )
              );
            }
          }
        }
      );
    }
  }, [safeAddress, dispatch, isMultiOwner]);

  return (
    <Authenticated>
      <Switch>
        <Route exact path={`${match.path}`} component={Dashboard} />
        <Route exact path={`${match.path}/people`} component={People} />
        <Route
          exact
          path={`${match.path}/people/new`}
          component={AddTeammate}
        />
        <Route
          exact
          path={`${match.path}/department/new`}
          component={AddDepartment}
        />
        <Route
          exact
          path={`${match.path}/people/view`}
          component={ViewTeammates}
        />
        <Route
          exact
          path={`${match.path}/people/view/:departmentId`}
          component={ViewTeammates}
        />
        <Route exact path={`${match.path}/payments`} component={Payments} />
        <Route
          exact
          path={`${match.path}/transactions`}
          component={isMultiOwner ? MultiSigTransactions : Transactions}
        />
        <Route
          exact
          path={`${match.path}/transactions/:transactionId`}
          component={
            isMultiOwner ? MultiSigTransactionDetails : TransactionDetails
          }
        />
        <Route
          exact
          path={`${match.path}/quick-transfer`}
          component={QuickTransfer}
        />
        <Route
          exact
          path={`${match.path}/account`}
          component={AccountSummary}
        />
        <Route exact path={`${match.path}/invite`} component={InviteOwners} />
        <Route component={NotFoundPage} />
      </Switch>
      <ToastMessage />
    </Authenticated>
  );
};

export default DashboardPage;
