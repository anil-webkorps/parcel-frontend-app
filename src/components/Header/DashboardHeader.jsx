import React from "react";

import CopyButton from "components/common/Copy";

import {
  HeaderLink,
  NavBar,
  NavBarContent,
  NavGroup,
  AccountAddress,
  CopyAddress,
} from "./styles";

export default function DashboardHeader() {
  return (
    <div>
      <NavBar className="dashboard">
        <NavBarContent>
          <HeaderLink to="/" className="dashboard-link">
            Parcel
          </HeaderLink>
          <NavGroup>
            <AccountAddress>
              <p>0xb723aa10...B1B5</p>
              <CopyAddress>
                <CopyButton
                  id="address"
                  tooltip="address"
                  value="0xb723aa10623b036aA72fa2e8a4a0d5eF77DBB1B5"
                />
              </CopyAddress>
            </AccountAddress>
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
