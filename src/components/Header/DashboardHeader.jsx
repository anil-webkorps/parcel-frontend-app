import React from "react";

import CopyButton from "components/common/Copy";
import SideNav from "components/SideNav";

import {
  HeaderLink,
  NavBar,
  NavBarContent,
  NavGroup,
  AccountAddress,
  Circle,
  Profile,
} from "./styles";

export default function DashboardHeader() {
  return (
    <div>
      <NavBar className="dashboard">
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <SideNav />
            <HeaderLink to="/" className="dashboard-link">
              Parcel
            </HeaderLink>
          </div>
          <NavGroup>
            <AccountAddress>
              <p>0xb723aa10...B1B5</p>
              <Circle className="ml-2">
                <CopyButton
                  id="address"
                  tooltip="address"
                  value="0xb723aa10623b036aA72fa2e8a4a0d5eF77DBB1B5"
                />
              </Circle>
            </AccountAddress>
            <Profile>
              <Circle>T</Circle>
              <div className="ml-3">
                <div className="name">Tarun</div>
                <div className="info">Account Info</div>
              </div>
            </Profile>
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
