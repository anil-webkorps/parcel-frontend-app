import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { Status } from "./styles";
import { Card } from "components/common/Card";

import { SideNavContext } from "context/SideNavContext";

export default function StatusCard() {
  const [toggled] = useContext(SideNavContext);

  return (
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
}
