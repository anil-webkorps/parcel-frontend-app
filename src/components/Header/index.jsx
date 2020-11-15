import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { HeaderLink, NavBar, NavBarContent, NavGroup, Logo } from "./styles";
import { toggleTheme } from "store/theme/actions";
import Toggle from "components/common/Toggle";
// import Button from "components/common/Button";
import ConnectButton from "components/Connect";
import DashboardHeader from "./DashboardHeader";

function PlainHeader() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return (
    <div>
      <NavBar>
        <NavBarContent>
          <HeaderLink to="/">
            <Logo className="mr-2" /> Parcel
          </HeaderLink>
          {/* <button onClick={handleToggle}>Toggle</button> */}
          <NavGroup>
            {/* <Button className="mr-2">Connect</Button> */}
            <ConnectButton>Connect </ConnectButton>
            <Toggle
              className="ml-5"
              onChange={handleToggle}
              toggled={isDarkMode}
            ></Toggle>
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
export default function Header() {
  const location = useLocation();

  if (location.pathname === "/dashboard") return <DashboardHeader />;

  return <PlainHeader />;
}
