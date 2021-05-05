import React from "react";
import { connectModal as reduxModal } from "redux-modal";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { cryptoUtils } from "parcel-sdk";

import { Modal, ModalHeader, ModalBody } from "components/common/Modal";
import { Input, TokenSelect, ErrorMessage } from "components/common/Form";
import PaySomeoneContainer from "./styles/PaySomeoneContainer"

export const MODAL_NAME = "pay-somone-modal";

function PaySomeoneModal(props) {
  const { show, handleHide, isEditMode, defaultValues, departmentId } = props;
  const { register, handleSubmit, errors, formState, control } = useForm({
    mode: "onChange",
  });

  const onSubmit = (value) => {
    console.log('submit');
  }
  const renderPaySomeone = () => {
        return (
            <PaySomeoneContainer>
                <div>
                    <div className="title">Paying To</div>
                    <div>
                        <Input
                        name="name"
                        register={register}
                        required={"name is required"}
                        placeholder={"Search People"}
                        style={{ width: "50%" }}
                        />
                        <ErrorMessage name="name" errors={errors} />
                    </div>
                </div>
            </PaySomeoneContainer>
        )
    };

    return (
        <Modal isOpen={true} toggle={handleHide}>
          <ModalHeader
            title={ `Pay Someone`}
            toggle={handleHide}
          />
          <ModalBody width="59rem">
            <form onSubmit={handleSubmit(onSubmit)}>{renderPaySomeone()}</form>
          </ModalBody>
        </Modal>
      );
}

export default reduxModal({ name: MODAL_NAME })(PaySomeoneModal);