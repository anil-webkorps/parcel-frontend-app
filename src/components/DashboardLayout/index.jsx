import React, { useState } from "react";

import { LayoutContainer, Main } from "./styles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <Navbar isSidebarOpen={isSidebarOpen} openSidebar={openSidebar} />
      <Main>{children}</Main>
    </LayoutContainer>
  );
}
