import React from "react";
import { useLocation, useHistory } from "react-router-dom";

import { HeaderLink, NavBar, NavBarContent, NavGroup } from "./styles";

import ConnectButton from "components/Connect";
import DashboardHeader from "./DashboardHeader";
import { useActiveWeb3React } from "hooks";
import Button from "components/common/Button";
import ParcelSvg from "assets/icons/parcel.svg";

function PlainHeader() {
  const location = useLocation();
  const history = useHistory();
  const isLoginPage = location.pathname === "/";
  const isSignupPage = location.pathname === "/signup";
  const { account } = useActiveWeb3React();

  const renderSignUpButton = () => (
    <Button
      type="button"
      onClick={() => {
        const searchParams = new URLSearchParams(location.search);
        history.push({ pathname: "/signup", search: searchParams.toString() });
      }}
      className="secondary ml-3"
    >
      Sign Up
    </Button>
  );
  const renderLoginButton = () => (
    <Button
      type="button"
      onClick={() => {
        const searchParams = new URLSearchParams(location.search);
        history.push({ pathname: "/", search: searchParams.toString() });
      }}
      className="secondary ml-3"
    >
      Login
    </Button>
  );

  return (
    <div>
      <NavBar>
        <NavBarContent>
          <div className="d-flex justify-content-center align-items-center">
            <HeaderLink to="/" className="dashboard-link">
              <img src={ParcelSvg} alt="parcel" width="160" />
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

  if (location.pathname.includes("/dashboard")) return <DashboardHeader />;

  return <PlainHeader />;
}
