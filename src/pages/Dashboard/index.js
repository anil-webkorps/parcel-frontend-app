import React from "react";
import { Route } from "react-router-dom";

import Dashboard from "components/Dashboard";
import People from "components/People";
import AddTeammate from "components/People/AddTeammate";
import AddDepartment from "components/People/AddDepartment";
import ViewTeammates from "components/People/ViewTeammates";
import Authenticated from "components/hoc/Authenticated";

const DashboardPage = ({ match }) => {
  return (
    <Authenticated>
      <Route exact path={`${match.path}`} component={Dashboard} />
      <Route exact path={`${match.path}/people`} component={People} />
      <Route exact path={`${match.path}/people/new`} component={AddTeammate} />
      <Route
        exact
        path={`${match.path}/department/new`}
        component={AddDepartment}
      />
      <Route
        exact
        path={`${match.path}/people/all`}
        component={ViewTeammates}
      />
    </Authenticated>
  );
};

export default DashboardPage;
