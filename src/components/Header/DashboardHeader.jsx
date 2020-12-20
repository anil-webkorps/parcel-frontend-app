import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import CopyButton from "components/common/Copy";
import SideNav from "components/SideNav";
import {
  makeSelectOwnerName,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import { minifyAddress } from "components/common/Web3Utils";
import { useActiveWeb3React } from "hooks";
import { logoutUser } from "store/logout/actions";
import logoutSaga from "store/logout/saga";
import { useInjectSaga } from "utils/injectSaga";
import LogoutPng from "assets/icons/logout.png";
import ParcelSvg from "assets/icons/parcel.svg";

import {
  HeaderLink,
  NavBar,
  NavBarContent,
  NavGroup,
  AccountAddress,
  Circle,
  Profile,
  ProfileMenu,
} from "./styles";

const logoutKey = "logout";

export default function DashboardHeader() {
  const { account } = useActiveWeb3React();
  const ownerName = useSelector(makeSelectOwnerName());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useInjectSaga({ key: logoutKey, saga: logoutSaga });

  const dispatch = useDispatch();

  const logout = () => {
    dispatch(logoutUser());
  };

  return (
    <div>
      <NavBar className="dashboard">
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <SideNav />
            <HeaderLink to="/dashboard" className="dashboard-link">
              <img src={ParcelSvg} alt="parcel" width="160" />
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
            <ProfileMenu>
              <div className="dropdown ml-3">
                <Profile className="profile">
                  <div className="d-flex align-items-center">
                    <Circle>
                      {ownerName && ownerName.substring(0, 1).toUpperCase()}
                    </Circle>
                    <div className="mx-3">
                      <div className="name">{ownerName}</div>
                      <div className="info">Account Info</div>
                    </div>
                  </div>
                </Profile>
                <ul className="dropdown_menu dropdown_menu--animated dropdown_menu-6">
                  <li className="flex-column">
                    <div className="option">Connected Account</div>
                    <div>{account && minifyAddress(account)}</div>
                  </li>
                  <li onClick={logout}>
                    <div className="option">Logout</div>
                    <div>
                      <img src={LogoutPng} alt="logout" width="16" />
                    </div>
                  </li>
                </ul>
              </div>
            </ProfileMenu>
          </NavGroup>
        </NavBarContent>
      </NavBar>
    </div>
  );
}
