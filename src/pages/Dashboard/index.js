import React from "react";

import Dashboard from "components/Dashboard";
import Authenticated from "components/hoc/Authenticated";

const DashboardPage = () => {
  return (
    <Authenticated>
      <Dashboard />
    </Authenticated>
  );
};

export default DashboardPage;
