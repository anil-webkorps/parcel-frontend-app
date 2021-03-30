import React, { useEffect } from "react";
import { faAngleDown, faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";

import ConnectedIcon from "assets/icons/navbar/connected.svg";
import { useActiveWeb3React } from "hooks";
import Img from "components/common/Img";
import { minifyAddress } from "components/common/Web3Utils";
import MassPayoutIcon from "assets/icons/navbar/mass-payout.svg";
import PaySomeoneIcon from "assets/icons/navbar/pay-someone.svg";
import AddFundsIcon from "assets/icons/navbar/add-funds.svg";
import USDIcon from "assets/icons/navbar/usd.svg";
import { ConnectedAccount, Nav, NewTransfer, Currency } from "./styles";
import { toggleDropdown } from "store/layout/actions";
import { CURRENCY, NEW_TRANSFER } from "store/layout/constants";
import { makeSelectDropdown } from "store/layout/selectors";

import notificationsSaga from "store/notifications/saga";
import notificationsReducer from "store/notifications/reducer";
import {
  closeNotifications,
  getNotifications,
  openNotifications,
  updateNotificationStatus,
} from "store/notifications/actions";
import {
  makeSelectHasSeen,
  makeSelectShowNotifications,
} from "store/notifications/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { useInjectReducer } from "utils/injectReducer";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import BellIcon from "assets/icons/navbar/bell.svg";

import { NotificationBell } from "components/Header/styles";

const notificationsKey = "notifications";

export default function Navbar({ isSidebarOpen, openSidebar }) {
  const { account } = useActiveWeb3React();

  const dropdown = useSelector(makeSelectDropdown());

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const hasSeen = useSelector(makeSelectHasSeen());
  const showNotifications = useSelector(makeSelectShowNotifications());

  useInjectReducer({ key: notificationsKey, reducer: notificationsReducer });

  useInjectSaga({ key: notificationsKey, saga: notificationsSaga });

  useEffect(() => {
    if (ownerSafeAddress && account)
      dispatch(getNotifications(ownerSafeAddress, account));
  }, [dispatch, ownerSafeAddress, account]);

  const toggleTransfer = () => {
    dispatch(toggleDropdown(NEW_TRANSFER, !dropdown[NEW_TRANSFER]));
  };

  const toggleCurrency = () => {
    dispatch(toggleDropdown(CURRENCY, !dropdown[CURRENCY]));
  };

  const toggleNotifications = () => {
    if (showNotifications) dispatch(closeNotifications());
    else {
      dispatch(openNotifications());
      if (account && ownerSafeAddress && !hasSeen) {
        dispatch(updateNotificationStatus(ownerSafeAddress, account));
      }
    }
  };

  return (
    <Nav>
      <div className="nav-icon" onClick={openSidebar}>
        <FontAwesomeIcon icon={faBars} />
      </div>
      <div className="nav-container">
        <ConnectedAccount>
          <Img src={ConnectedIcon} alt="connected" className="mr-2" />
          <div className="text">{minifyAddress(account)}</div>
        </ConnectedAccount>
        <NewTransfer onClick={toggleTransfer}>
          <div className="text">New Transfer</div>
          <FontAwesomeIcon icon={faAngleDown} className="ml-2" color="#fff" />
          <div
            className={`transfer-dropdown ${dropdown[NEW_TRANSFER] && "show"}`}
          >
            <div className="transfer-option">
              <Img src={MassPayoutIcon} alt="mass-payout" className="icon" />
              <div className="name">Mass Payout</div>
            </div>
            <div className="transfer-option">
              <Img src={PaySomeoneIcon} alt="pay-someone" className="icon" />
              <div className="name">Pay Someone</div>
            </div>
            <div className="transfer-option">
              <Img src={AddFundsIcon} alt="add-funds" className="icon" />
              <div className="name">Add Funds</div>
            </div>
          </div>
        </NewTransfer>
        <Currency onClick={toggleCurrency}>
          <Img src={USDIcon} alt="currency" className="mr-2" />
          <div className="text">USD</div>
          <FontAwesomeIcon
            icon={faAngleDown}
            className="ml-3"
            color="#373737"
          />
          <div className={`currency-dropdown ${dropdown[CURRENCY] && "show"}`}>
            <div className="currency-option">
              <Img src={USDIcon} alt="currency-usd" className="icon" />
              <div className="name">USD</div>
            </div>
            <div className="currency-option">
              <Img src={USDIcon} alt="currency-usd" className="icon" />
              <div className="name">USD</div>
            </div>
            <div className="currency-option">
              <Img src={USDIcon} alt="currency-usd" className="icon" />
              <div className="name">USD</div>
            </div>
            <div className="currency-option">
              <Img src={USDIcon} alt="currency-usd" className="icon" />
              <div className="name">USD</div>
            </div>
          </div>
        </Currency>
        <NotificationBell onClick={toggleNotifications} hasSeen={hasSeen}>
          <Img src={BellIcon} className="bell" alt="bell" />
          {!hasSeen && <div className="prompt"></div>}
        </NotificationBell>
      </div>
    </Nav>
  );
}
