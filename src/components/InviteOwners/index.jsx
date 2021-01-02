import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import { useLocalStorage } from "hooks";
import transactionsSaga from "store/transactions/saga";
import { addTransaction } from "store/transactions/actions";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import dashboardReducer from "store/dashboard/reducer";
import dashboardSaga from "store/dashboard/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getSafeBalances } from "store/dashboard/actions";
import Loading from "components/common/Loading";

import { Title, Heading, ActionItem } from "components/People/styles";
import { Container, OwnerDetails } from "./styles";
import { Circle } from "components/Header/styles";
import { minifyAddress } from "components/common/Web3Utils";

const dashboardKey = "dashboard";

export default function InviteOwners() {
  const [sign] = useLocalStorage("SIGNATURE");

  // Reducers
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });

  // Sagas
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });

  const { register, errors, handleSubmit, formState } = useForm({
    mode: "onChange",
  });

  // const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const history = useHistory();

  const onSubmit = async (values) => {
    console.log({ values });
  };

  const goBack = () => {
    history.goBack();
  };

  const renderInviteOwners = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="invite-owners">
          <Title className="mb-2">Owners</Title>
          <Heading>List of all owners of the safe</Heading>

          {false && <Loading color="#7367f0" />}

          <Row>
            <Col lg="12">
              <OwnerDetails>
                <div className="left">
                  <div className="icon">
                    <FontAwesomeIcon icon={faUserCircle} color="#333" />
                  </div>
                  <div className="details">
                    <div className="name">Rohith</div>
                    <div className="address">
                      Address:{" "}
                      {minifyAddress(
                        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
                      )}
                    </div>
                  </div>
                </div>
                <div className="invite-status">Invite to parcel</div>
              </OwnerDetails>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <OwnerDetails>
                <div className="left">
                  <div className="icon">
                    <FontAwesomeIcon icon={faUserCircle} color="#333" />
                  </div>
                  <div className="details">
                    <div className="name">Rohith</div>
                    <div className="address">
                      Address:{" "}
                      {minifyAddress(
                        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
                      )}
                    </div>
                  </div>
                </div>
                <div className="invite-status">Invite to parcel</div>
              </OwnerDetails>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <OwnerDetails>
                <div className="left">
                  <div className="icon">
                    <FontAwesomeIcon icon={faUserCircle} color="#333" />
                  </div>
                  <div className="details">
                    <div className="name">Rohith</div>
                    <div className="address">
                      Address:{" "}
                      {minifyAddress(
                        "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"
                      )}
                    </div>
                  </div>
                </div>
                <div className="invite-status">Invite to parcel</div>
              </OwnerDetails>
            </Col>
          </Row>

          <Row className="mt-5 mb-3 align-items-center">
            <Col lg="9">
              <Input
                type="text"
                name="email"
                register={register}
                required={`Email is required`}
                pattern={{
                  value: /^0x[a-fA-F0-9]{40}$/,
                  message: "Invalid Ethereum Address",
                }}
                placeholder="satoshi@nakamoto.com"
              />
              <ErrorMessage name="email" errors={errors} />
            </Col>
            <Col lg="3">
              <Button
                large
                type="submit"
                disabled={!formState.isValid}
                className="py-0"
              >
                Send
              </Button>
            </Col>
          </Row>
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
