import React from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";

import CopyButton from "components/common/Copy";
import { minifyAddress } from "components/common/Web3Utils";
import TeamPng from "assets/images/user-team.png";
import Button from "components/common/Button";
import { deleteTeammate } from "store/add-teammate/actions";
import { Title, Heading, Summary } from "./styles";
import { Circle } from "components/Header/styles";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { makeSelectUpdating } from "store/add-teammate/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import addTeammateReducer from "store/add-teammate/reducer";
import addTeammateSaga from "store/add-teammate/saga";

export const MODAL_NAME = "delete-teammate-modal";
const addTeammateKey = "addTeammate";

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
    salary,
    currency,
    address,
    peopleId,
    params,
  } = props;

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });

  useInjectSaga({ key: addTeammateKey, saga: addTeammateSaga });

  const dispatch = useDispatch();

  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const updating = useSelector(makeSelectUpdating());

  const confirmDelete = () => {
    dispatch(
      deleteTeammate(ownerSafeAddress, peopleId, params && params.departmentId)
    );
  };

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Delete Teammate</Title>
        <Heading>Are you sure you want to delete this teammate?</Heading>
      </ModalHeader>
      <Summary className="mb-3 mx-auto" style={{ maxWidth: "420px" }}>
        <div className="left">
          <img src={TeamPng} alt="teammate" width="80" />
        </div>
        <div className="right">
          <div className="mb-3">
            <div className="section-title mb-1">Name</div>
            <div className="section-desc">
              {firstName} {lastName}
            </div>
          </div>
          <div className="mb-3">
            <div className="section-title mb-1">Team</div>
            <div className="section-desc">{departmentName}</div>
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
      <div className="d-flex justify-content-center align-items-center">
        <div className="col-6">
          <Button large onClick={handleHide} className="secondary">
            Close
          </Button>
        </div>
        <div className="col-6">
          <Button
            large
            style={{ backgroundColor: "#ff0a0a" }}
            onClick={confirmDelete}
            loading={updating}
            disabled={updating}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(TeammateDetailsModal);
