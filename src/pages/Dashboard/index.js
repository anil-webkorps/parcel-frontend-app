import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

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
import { ToastMessage } from "components/common/Toast";
import { useSocket } from "hooks";
// import { closeNotifications } from "store/notifications/actions";
// import { makeSelectShowNotifications } from "store/notifications/selectors";

const DashboardPage = ({ match }) => {
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());
  const safeAddress = useSelector(makeSelectOwnerSafeAddress());
  useSocket({ isMultiOwner, safeAddress });

  // const showNotifications = useSelector(makeSelectShowNotifications());
  // const dispatch = useDispatch();

  // const closeNotificationsIfOpen = () => {
  //   if (showNotifications) dispatch(closeNotifications());
  // };

  return (
    <Authenticated>
      <div>
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
      </div>
    </Authenticated>
  );
};

export default DashboardPage;
