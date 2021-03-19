import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faTimes } from "@fortawesome/free-solid-svg-icons";

import Img from "components/common/Img";
import ParcelLogo from "assets/icons/parcel-logo.svg";
import HomeIcon from "assets/icons/sidebar/home-icon.svg";
import PeopleIcon from "assets/icons/sidebar/people-icon.svg";
import AssetsIcon from "assets/icons/sidebar/assets-icon.svg";
import TransactionsIcon from "assets/icons/sidebar/transactions-icon.svg";
import SupportIcon from "assets/icons/sidebar/support-icon.svg";
import InviteIcon from "assets/icons/sidebar/invite-icon.svg";
import OwnerIcon from "assets/icons/sidebar/owner-icon.svg";
import SettingsIcon from "assets/icons/sidebar/settings-icon.svg";
import LogoutIcon from "assets/icons/sidebar/logout-icon.svg";

import { DashboardSidebar } from "./styles";

export default function Sidebar({ isSidebarOpen, closeSidebar }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = () => {
    setIsSettingsOpen((open) => !open);
  };

  return (
    <DashboardSidebar className={`${isSidebarOpen && "sidebar-responsive"}`}>
      <div className="close-btn" onClick={closeSidebar}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      <div className="parcel-logo">
        <Img src={ParcelLogo} alt="parcel" width="100%" />
      </div>
      <div className="settings-container">
        <div className="settings" onClick={toggleSettings}>
          <div>
            <div className="company-title">Parcel</div>
            <div className="company-subtitle">4 members</div>
          </div>
          <div>
            <FontAwesomeIcon icon={faAngleDown} />
          </div>
          <div className={`settings-dropdown ${isSettingsOpen && "show"}`}>
            <div className="settings-option">
              <div className="icon">
                <Img src={OwnerIcon} alt="owners" />
              </div>
              <div className="name">Owners</div>
            </div>
            <div className="settings-option">
              <div className="icon">
                <Img src={SettingsIcon} alt="settings" />
              </div>
              <div className="name">Settings</div>
            </div>
            <div className="settings-option">
              <div className="icon">
                <Img src={LogoutIcon} alt="logout" />
              </div>
              <div className="name">Logout</div>
            </div>
          </div>
        </div>
      </div>

      <div className="menu-items">
        <div className="menu-item menu-item-highlighted">
          <div className="icon">
            <Img src={HomeIcon} alt="home" />
          </div>
          <div className="name">Home</div>
        </div>
        <div className="menu-item">
          <div className="icon">
            <Img src={PeopleIcon} alt="people" />
          </div>
          <div className="name">People</div>
        </div>
        <div className="menu-item">
          <div className="icon">
            <Img src={AssetsIcon} alt="home" />
          </div>
          <div className="name">Assets</div>
        </div>
        <div className="menu-item">
          <div className="icon">
            <Img src={TransactionsIcon} alt="transactions" />
          </div>
          <div className="name">Transactions</div>
        </div>
        <div className="menu-item">
          <div className="icon">
            <Img src={SupportIcon} alt="support" />
          </div>
          <div className="name">Support</div>
        </div>
      </div>

      <div className="invite-owners">
        <div className="icon">
          <Img src={InviteIcon} alt="invite" />
        </div>
        <div className="name">Invite Members</div>
      </div>
    </DashboardSidebar>
  );
}
