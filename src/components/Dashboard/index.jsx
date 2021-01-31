import React, { useContext } from "react";
import { useSelector } from "react-redux";

import { Info, Container } from "./styles";
import { makeSelectOwnerName } from "store/global/selectors";

import { SideNavContext } from "context/SideNavContext";
import AccountCard from "./AccountCard";
import PaymentsCard from "./PaymentsCard";
import QuickTransferCard from "./QuickTransferCard";

export default function Dashboard() {
  const [toggled] = useContext(SideNavContext);
  const ownerName = useSelector(makeSelectOwnerName());

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
            maxWidth: toggled ? "900px" : "1200px",
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
          maxWidth: toggled ? "900px" : "1200px",
          transition: "all 0.25s linear",
        }}
      >
        <AccountCard />
        <QuickTransferCard />
        <PaymentsCard />
      </Container>
    </div>
  );
}
