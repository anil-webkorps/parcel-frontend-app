import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import { useLocalStorage } from "hooks";
import invitationSaga from "store/invitation/saga";
import invitationReducer from "store/invitation/reducer";
import {
  getInvitations,
  createInvitation,
  approveInvitation,
} from "store/invitation/actions";
import {
  makeSelectLoading,
  makeSelectSafeOwners,
  makeSelectSuccess,
  makeSelectCreating,
  makeSelectCreatedBy,
} from "store/invitation/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";
import { useActiveWeb3React } from "hooks";
import CopyButton from "components/common/Copy";

import { Title, Heading, ActionItem } from "components/People/styles";
import { Container, OwnerDetails } from "./styles";
import { Circle } from "components/Header/styles";
import { minifyAddress } from "components/common/Web3Utils";
import { Stepper, StepCircle } from "components/common/Stepper";

const invitationKey = "invitation";

export default function InviteOwners() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [showEmail, setShowEmail] = useState();
  const [ownerToBeInvited, setOwnerToBeInvited] = useState();

  const { account } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: invitationKey, reducer: invitationReducer });

  // Sagas
  useInjectSaga({ key: invitationKey, saga: invitationSaga });

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "all",
  });

  // const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const safeOwners = useSelector(makeSelectSafeOwners());
  const createdBy = useSelector(makeSelectCreatedBy());
  const loading = useSelector(makeSelectLoading());
  const creatingInvitation = useSelector(makeSelectCreating());
  const successfullyInvited = useSelector(makeSelectSuccess());

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (successfullyInvited && ownerSafeAddress) {
      dispatch(getInvitations(ownerSafeAddress));
      setShowEmail();
    }
  }, [dispatch, successfullyInvited, ownerSafeAddress]);

  const onSubmit = async (values) => {
    if (!account || !ownerToBeInvited || !ownerSafeAddress) return;
    dispatch(
      createInvitation({
        safeAddress: ownerSafeAddress,
        createdBy: account,
        toAddress: ownerToBeInvited,
        fromAddress: account,
        toEmail: values.email,
        fromEmail: "rohith.test@gmail.com",
      })
    );
  };

  const approveOwner = async (owner, invitationDetails) => {
    if (!owner || !invitationDetails) return;

    const { toPublicKey, invitationId } = invitationDetails;
    const encryptionKeyData = await cryptoUtils.encryptUsingPublicKey(
      encryptionKey,
      toPublicKey
    );
    dispatch(
      approveInvitation(encryptionKeyData, invitationId, ownerSafeAddress)
    );
  };

  const goBack = () => {
    history.goBack();
  };

  const toggleShowEmail = (idx, owner) => {
    if (showEmail === idx) {
      setShowEmail();
      setOwnerToBeInvited();
    } else {
      setShowEmail(idx);
      setOwnerToBeInvited(owner);
    }
  };

  const renderInvitationStatus = (owner, invitationDetails, idx) => {
    if (owner === account) {
      return <div className="highlighted-status">You</div>;
    }
    if (owner === createdBy) {
      return <div className="highlighted-status">Owner</div>;
    }

    if (!invitationDetails) {
      return (
        <div
          className="invite-status"
          onClick={() => toggleShowEmail(idx, owner)}
        >
          Invite to parcel
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 0) {
      // sent invite and awaiting confirmation
      return (
        <div className="d-flex align-items-center">
          <div className="awaiting-status mr-2">Awaiting Confirmation</div>
          {invitationDetails.invitationLink && (
            <CopyButton
              id="invitation-link"
              tooltip="Invitation Link"
              value={invitationDetails.invitationLink}
              size="md"
              color="#7367f0"
            />
          )}
        </div>
      );
    }
    if (invitationDetails && invitationDetails.status === 1) {
      // sent invite and awaiting confirmation
      return (
        <div
          className="approved-status"
          onClick={() => approveOwner(owner, invitationDetails)}
        >
          Approve
        </div>
      );
    }

    if (invitationDetails && invitationDetails.status === 2) {
      // sent invite and awaiting confirmation
      return <div className="joined-status">Owner</div>;
    }

    return null;
  };

  const renderEmail = () => (
    <div className="send-email">
      <Row>
        <Col lg="8">
          <Input
            type="text"
            name="email"
            register={register}
            required={`Email is required`}
            pattern={{
              value: /\S+@\S+\.\S+/,
              message: "Invalid email address",
            }}
            placeholder="satoshi@nakamoto.com"
          />
        </Col>
        <Col lg="4">
          <Button
            large
            type="submit"
            disabled={!formState.isValid}
            style={{ minHeight: "0", height: "100%" }}
            loading={creatingInvitation}
          >
            Send
          </Button>
        </Col>
      </Row>
      <ErrorMessage name="email" errors={errors} />
    </div>
  );

  const renderInviteOwners = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="invite-owners">
          <Title className="mb-2">Owners</Title>
          <Heading>List of all owners of the safe</Heading>

          <Stepper count={3}>
            <StepCircle
              title={`Step 1`}
              subtitle={`Invite Owner to Parcel`}
              backgroundColor="#7367f0"
            />
            <StepCircle
              title={`Step 2`}
              subtitle={`Owner Accepts Invite`}
              // icon={<FontAwesomeIcon icon={faCheckCircle} color="#3bd800" />}
              backgroundColor="#373737"
            />
            <StepCircle
              title={`Step 3`}
              subtitle={`Approve Owner`}
              backgroundColor="#3bd800"
              last
            />
          </Stepper>

          {loading && (
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ height: "250px" }}
            >
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}

          {!loading &&
            safeOwners &&
            safeOwners.map(({ name, owner, invitationDetails }, idx) => (
              <Row key={`${owner}${idx}`}>
                <Col lg="12">
                  <OwnerDetails>
                    <div className="left">
                      <div className="icon">
                        <FontAwesomeIcon icon={faUserCircle} color="#333" />
                      </div>
                      <div className="details">
                        <div className="name">
                          {cryptoUtils.decryptDataUsingEncryptionKey(
                            name,
                            encryptionKey
                          )}
                        </div>
                        <div className="address">
                          Address: {minifyAddress(owner)}
                        </div>
                      </div>
                    </div>
                    {renderInvitationStatus(owner, invitationDetails, idx)}
                    {showEmail === idx && renderEmail()}
                  </OwnerDetails>
                </Col>
              </Row>
            ))}
        </Card>
      </form>
    );
  };

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
            maxWidth: "1200px",
            transition: "all 0.25s linear",
          }}
          className="mx-auto"
        >
          <Button iconOnly className="p-0" onClick={goBack}>
            <ActionItem>
              <Circle>
                <FontAwesomeIcon icon={faLongArrowAltLeft} color="#fff" />
              </Circle>
              <div className="mx-3">
                <div className="name">Back</div>
              </div>
            </ActionItem>
          </Button>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderInviteOwners()}
      </Container>
    </div>
  );
}
