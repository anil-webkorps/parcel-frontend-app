import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import {
  faArrowRight,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import { Info, Container, Payments, Status } from "./styles";
import { Card } from "components/common/Card";
import { makeSelectOwnerName } from "store/global/selectors";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import { SideNavContext } from "context/SideNavContext";
import AccountCard from "./AccountCard";

export default function Dashboard() {
  const [toggled] = useContext(SideNavContext);
  const ownerName = useSelector(makeSelectOwnerName());
  // eslint-disable-next-line
  const [tokenDetails, setTokenDetails] = useState([
    {
      id: 0,
      name: "Ether",
      icon: ETHIcon,
      balance: "2.00",
      usd: "4000",
    },
    {
      id: 1,
      name: "DAI",
      icon: DAIIcon,
      balance: "100.00",
      usd: "100",
    },
    {
      id: 2,
      name: "USDC",
      icon: USDCIcon,
      balance: "100.00",
      usd: "100",
    },
  ]);

  // eslint-disable-next-line
  const [paymentDetails, setPaymentDetails] = useState([
    {
      id: 0,
      amount: "2",
      token: "ETH",
      date: new Date(),
    },
    {
      id: 1,
      amount: "400",
      token: "DAI",
      date: new Date(),
    },
    {
      id: 2,
      amount: "600",
      token: "USDC",
      date: new Date(),
    },
    {
      id: 3,
      amount: "5",
      token: "ETH",
      date: new Date(),
    },
  ]);

  const renderStatus = () => (
    <div className="status">
      <Card
        className="p-4 d-flex justify-content-center align-items-center"
        style={{ background: "#fff", width: toggled ? "30em" : "33em" }}
      >
        <Status>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            color="#FFD316"
            size="lg"
          />

          <div className="ml-2">
            <div className="status-title">Insufficient Amount</div>
            <div className="status-subtitle">
              IN YOUR WALLET FOR NEXT PAYROLL
            </div>
          </div>
        </Status>
      </Card>
    </div>
  );

  const renderPayments = () => (
    <div className="payments">
      <Card
        className="p-4"
        style={{ background: "#fff", width: toggled ? "30em" : "33em" }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Upcoming Payments </div>
            <div className="card-subtitle">List of payments by team & date</div>
          </div>
          <div className="circle">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </div>
        </div>

        {paymentDetails.map(({ id, amount, token, date }) => (
          <Payments key={id}>
            <div className="payment-date">
              {format(date, "MMM")}
              <span>{format(date, "dd")}</span>
            </div>
            <div className="payment-details">
              <div className="title">AMOUNT TO BE PAID</div>
              <div className="amount">
                {amount} {token}
              </div>
            </div>
          </Payments>
        ))}
      </Card>
    </div>
  );

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <Info>
        <div
          style={{
            maxWidth: toggled ? "900px" : "1280px",
            transition: "all 0.25s linear",
          }}
          className="mx-auto"
        >
          <div className="title">Hey {ownerName},</div>
          <div className="subtitle">
            We have a few things for you to look at
          </div>
        </div>
      </Info>
      <Container
        style={{
          maxWidth: toggled ? "900px" : "1280px",
          transition: "all 0.25s linear",
        }}
      >
        <AccountCard />
        {renderStatus()}
        {renderPayments()}
      </Container>
    </div>
  );
}
