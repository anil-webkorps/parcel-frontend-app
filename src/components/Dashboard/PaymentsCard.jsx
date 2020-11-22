import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useSelector } from "react-redux";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

import { Payments } from "./styles";
import { Card } from "components/common/Card";

import { SideNavContext } from "context/SideNavContext";

export default function PaymentsCard() {
  const [toggled] = useContext(SideNavContext);

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
}
