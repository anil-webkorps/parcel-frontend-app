import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

const SuccessModal = (props) => {
  const { handleToggle, show } = props;

  return (
    <Modal isOpen={show} centered>
      <ModalHeader toggle={handleToggle}>
        <div>Registered Successfully</div>
      </ModalHeader>
      <ModalBody>
        <p>You will be redirected to the dashboard...</p>
      </ModalBody>
    </Modal>
  );
};

export default SuccessModal;
