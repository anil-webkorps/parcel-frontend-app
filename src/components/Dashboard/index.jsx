import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import { Info, Container, Assets, Payments, Status } from "./styles";
import { Card } from "components/common/Card";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import { SideNavContext } from "context/SideNavContext";

export default function Dashboard() {
  const [toggled] = useContext(SideNavContext);
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
  return (
    <div
      className="position-relative"
      style={{
        marginLeft: toggled ? "150px" : "0",
        transition: "all 0.5s linear",
      }}
    >
      <Info>
        <div className="title">Hey Tarun,</div>
        <div className="subtitle">We have a few things for you to look at</div>
      </Info>
      <Container>
        <div
          className="account"
          style={{
            maxWidth: toggled ? "650px" : "750px",
          }}
        >
          <Card
            className="p-4"
            style={{
              background: "#fff",
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="card-title">Account</div>
                <div className="card-subtitle">
                  Find overview of your wallets and manage payments
                </div>
              </div>
              <div className="circle">
                <FontAwesomeIcon icon={faArrowRight} color="#fff" />
              </div>
            </div>

            <div className="overview-cards">
              <div className="overview-card">
                <div className="overview-text">Total Balance</div>
                <div className="overview-amount">$12,000</div>
              </div>
              <div className="overview-card">
                <div className="overview-text">Interest Earned</div>
                <div className="overview-amount">$2,000</div>
              </div>
            </div>
            {tokenDetails.map(({ id, name, icon, usd, balance }) => (
              <Assets key={id}>
                <div className="d-flex align-items-center">
                  <img src={icon} alt="ether" width="30" />
                  <div>
                    <div className="token-balance">{balance}</div>
                    <div className="token-name">{name}</div>
                  </div>
                </div>
                <div className="token-usd">
                  <div className="token-usd-title">Total Value</div>
                  <div className="token-usd-amount">${usd}</div>
                </div>
              </Assets>
            ))}
          </Card>
        </div>
        <div className="status">
          <Card
            className="p-4 d-flex justify-content-center align-items-center"
            style={{ background: "#fff" }}
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
        <div className="payments">
          <Card className="p-4" style={{ background: "#fff" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="card-title">Upcoming Payments </div>
                <div className="card-subtitle">
                  List of payments by team & date
                </div>
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
      </Container>
    </div>
  );
}