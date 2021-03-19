import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { Nav } from "./styles";

export default function Navbar({ isSidebarOpen, openSidebar }) {
  return (
    <Nav>
      <div className="nav-icon" onClick={openSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="nav">Navbar</div>
    </Nav>
  );
}
