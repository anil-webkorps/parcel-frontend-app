import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import CopyButton from "components/common/Copy";
import { minifyAddress } from "components/common/Web3Utils";
import { numToOrd } from "utils/date-helpers";

import { Title, Heading, Summary } from "./styles";
import { Circle } from "components/Header/styles";

export const MODAL_NAME = "teammate-details-modal";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
  }
`;

function TeammateDetailsModal(props) {
  const {
    show,
    handleHide,
    firstName,
    lastName,
    departmentName,
    payCycleDate,
    salary,
    currency,
    address = "0xBF5B1b3E6a41e26991fA49A34B2eA22b4ecf59c1",
  } = props;
  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Teammate</Title>
        <Heading>Here are his details</Heading>
      </ModalHeader>
      <Summary className="mb-3 mx-auto" style={{ maxWidth: "420px" }}>
        <div className="left">
          <FontAwesomeIcon
            icon={faUserCircle}
            color="#fff"
            size="3x"
            style={{ width: "80px", margin: "auto" }}
          />
        </div>
        <div className="right">
          <div className="mb-3">
            <div className="section-title mb-1">Name</div>
            <div className="section-desc">
              {firstName} {lastName}
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Department</div>
            <div className="section-desc">{departmentName}</div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Pay Date</div>
            <div className="section-desc">
              {numToOrd(payCycleDate)} of every month
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Pay Amount</div>
            <div className="section-desc">
              {salary} {currency}
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Wallet Address</div>
            <div className="section-desc d-flex align-items-center">
              <p>{minifyAddress(address)}</p>
              <Circle
                className="ml-3"
                style={{ height: "30px", width: "30px" }}
              >
                <CopyButton
                  id="address"
                  tooltip="teammate address"
                  value={address}
                />
              </Circle>
            </div>
          </div>
        </div>
      </Summary>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(TeammateDetailsModal);
