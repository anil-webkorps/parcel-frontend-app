import React from "react";
import { useLocation } from "react-router-dom";

import {
  HeaderLink,
  NavBar,
  NavBarContent,
  NavGroup,
  AccountAddress,
  Circle,
} from "./styles";
import CopyButton from "components/common/Copy";

import ConnectButton from "components/Connect";
import DashboardHeader from "./DashboardHeader";
import { useActiveWeb3React } from "hooks";
import { Account } from "components/common/Web3Utils";
import Button from "components/common/Button";

function PlainHeader() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const { account } = useActiveWeb3React();

  const renderSignUpButton = () => (
    <Button type="button" to="/signup" className="secondary ml-3">
      Sign Up
    </Button>
  );
  const renderLoginButton = () => (
    <Button type="button" to="/" className="secondary ml-3">
      Login
    </Button>
  );

  return (
    <div>
      <NavBar>
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <HeaderLink to="/" className="dashboard-link">
              Parcel
            </HeaderLink>
          </div>
          <NavGroup>
            {!account && <ConnectButton>Connect</ConnectButton>}
            {isLoginPage && renderSignUpButton()}
            {isSignupPage && renderLoginButton()}
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
