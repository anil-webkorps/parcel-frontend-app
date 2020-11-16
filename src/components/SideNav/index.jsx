import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faBars } from "@fortawesome/free-solid-svg-icons";

import { SideNavContext } from "context/SideNavContext";
import navItems from "./navItems";

import { NavItem, SideNav, Version } from "./styles";

export default function Navbar() {
  const [toggled, handleToggle] = useContext(SideNavContext);
  return (
    <div style={{ position: "absolute", left: "2%" }}>
      {toggled ? (
        <FontAwesomeIcon
          onClick={handleToggle}
          icon={faTimes}
          color="#fff"
          className="mr-3"
          style={{ cursor: "pointer" }}
        />
      ) : (
        <FontAwesomeIcon
          onClick={handleToggle}
          icon={faBars}
          color="#fff"
          className="mr-3"
          style={{ cursor: "pointer" }}
        />
      )}

      <SideNav
        onClick={handleToggle}
        style={{ width: toggled ? "230px" : "0" }}
      >
        {navItems.map(({ id, link, name, icon, ...rest }) => (
          <NavItem key={id} {...rest}>
            <FontAwesomeIcon icon={icon} color="#fff" />
            <Link to={link}>{name}</Link>
          </NavItem>
        ))}

        <Version>Version 1.0</Version>
      </SideNav>
    </div>
  );
}
