import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

// import { Status } from "./styles";
import { Card } from "components/common/Card";

export default function QuickTransferCard() {
  return (
    <div className="status">
      <Card className="p-4" style={{ width: "33em" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Quick Transfer</div>
            <div className="card-subtitle">
              Send money quickly to address and wallets.
            </div>
          </div>
          <div className="circle">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </div>
        </div>
      </Card>
    </div>
  );
}
