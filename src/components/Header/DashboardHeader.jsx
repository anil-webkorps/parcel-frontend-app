import React from "react";
import { useSelector } from "react-redux";

import CopyButton from "components/common/Copy";
import SideNav from "components/SideNav";
import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { minifyAddress } from "components/common/Web3Utils";
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
  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  return (
    <div>
      <NavBar className="dashboard">
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <SideNav />
            <HeaderLink to="/dashboard" className="dashboard-link">
              Parcel
            </HeaderLink>
          </div>
          <NavGroup>
            <AccountAddress>
              <p>{minifyAddress(ownerSafeAddress)}</p>
              <Circle className="ml-2">
                <CopyButton
                  id="address"
                  tooltip="safe address"
                  value={ownerSafeAddress}
                />
              </Circle>
            </AccountAddress>
            <Profile>
              <Circle>
                {ownerName && ownerName.substring(0, 1).toUpperCase()}
              </Circle>
              <div className="mx-3">
                <div className="name">{ownerName}</div>
                <div className="info">Account Info</div>
              </div>
            </Profile>
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
