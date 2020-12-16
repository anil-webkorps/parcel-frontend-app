import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
// import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

// import { SideNavContext } from "context/SideNavContext";
import navItems from "./navItems";

import { NavItem, SideNav, Version } from "./styles";

export default function Navbar() {
  const location = useLocation();
  useEffect(() => {
    const sidebar = document.getElementById("sidebar");

    window.onscroll = function () {
      sidebar.style.top = `${
        80 - window.scrollY > 0 ? 80 - window.scrollY : 0
      }px`;

      makeSticky();
    };

    function makeSticky() {
      if (window.scrollY > 0) {
        sidebar.classList.add("sticky");
      } else {
        sidebar.classList.remove("sticky");
      }
    }
  }, []);

  return (
    <div>
      <SideNav id="sidebar">
        {navItems.map(({ id, link, name, icon, ...rest }) => (
          <NavItem
            key={id}
            className={location.pathname === link ? "active" : ""}
            {...rest}
          >
            <Link to={link}>
              <div className="icon">
                <FontAwesomeIcon icon={icon} color="#fff" />
              </div>
              <div className="name">{name}</div>
            </Link>
          </NavItem>
        ))}

        <Version>v1.0</Version>
      </SideNav>
    </div>
  );
}
