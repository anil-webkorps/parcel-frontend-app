import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "components/Dashboard";
import People from "components/People";
import AddTeammate from "components/People/AddTeammate";
import AddDepartment from "components/People/AddDepartment";
import ViewTeammates from "components/People/ViewTeammates";
import Payments from "components/Payments";
import Transactions from "components/Transactions";
import QuickTransfer from "components/QuickTransfer";
import InviteOwners from "components/InviteOwners";
import Authenticated from "components/hoc/Authenticated";
import NotFoundPage from "pages/NotFound";

const DashboardPage = ({ match }) => {
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
          component={Transactions}
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
