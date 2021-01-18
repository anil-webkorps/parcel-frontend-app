import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Dashboard from "components/Dashboard";
import People from "components/People";
import AddTeammate from "components/People/AddTeammate";
import AddDepartment from "components/People/AddDepartment";
import ViewTeammates from "components/People/ViewTeammates";
import Payments from "components/Payments";
import Transactions from "components/Transactions";
import MultiSigTransactions from "components/Transactions/MultiSigTransactions";
import QuickTransfer from "components/QuickTransfer";
import InviteOwners from "components/InviteOwners";
import Authenticated from "components/hoc/Authenticated";
import NotFoundPage from "pages/NotFound";
import safeReducer from "store/safe/reducer";
import safeSaga from "store/safe/saga";
import { getOwnersAndThreshold } from "store/safe/actions";
import { makeSelectIsMultiOwner } from "store/safe/selectors";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";

const safeKey = "safe";

const DashboardPage = ({ match }) => {
  // Reducers
  useInjectReducer({ key: safeKey, reducer: safeReducer });

  // Sagas
  useInjectSaga({ key: safeKey, saga: safeSaga });

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const isMultiOwner = useSelector(makeSelectIsMultiOwner());

  const dispatch = useDispatch();

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getOwnersAndThreshold(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);
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
        {/* TODO: Depending on threshold, render <Transactions /> or <MultiSigTransactions /> */}
        <Route
          exact
          path={`${match.path}/transactions`}
          component={isMultiOwner ? MultiSigTransactions : Transactions}
        />
        <Route
          exact
          path={`${match.path}/quick-transfer`}
          component={QuickTransfer}
        />
        <Route exact path={`${match.path}/invite`} component={InviteOwners} />
        <Route component={NotFoundPage} />
      </Switch>
    </Authenticated>
  );
};

export default DashboardPage;
