import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
// import CreateSafeForm from "./CreateSafeForm";
// import SignButton from "../AuthorizeButton";
import { useInjectReducer } from "utils/injectReducer";
import reducer from "store/registerWizard/reducer";
import {
  Background,
  InnerCard,
  Image,
  StepHeader,
  StepDetails,
} from "./styles";
import { makeSelectStep } from "store/registerWizard/selectors";
import { chooseStep } from "store/registerWizard/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";

const key = "registerWizard";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
};

const REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Company Name",
  [STEPS.TWO]: "Owner Address",
  [STEPS.ZERO]: "Payment Threshold",
  [STEPS.ZERO]: "Privacy",
};

const Register = () => {
  // const [hasSigned, setHasSigned] = useState(false);
  const [sign, setSign] = useLocalStorage("SIGNATURE");

  const { active } = useActiveWeb3React();

  useInjectReducer({ key, reducer });

  const dispatch = useDispatch();
  const step = useSelector(makeSelectStep());

  useEffect(() => {
    if (active && step === STEPS.ZERO) dispatch(chooseStep(step + 1));
    if (!active) dispatch(chooseStep(STEPS.ZERO));
  }, [active, dispatch, step]);

  useEffect(() => {
    if (sign && sign[0] && active) {
      console.log({ sign });
      // setHasSigned(true);
    }
  }, [active, sign]);

  const renderConnect = () => (
    <div>
      <Image minHeight="323px" />
      <InnerCard height="257px">
        <h2 className="text-center">Welcome to Parcel</h2>
        <div className="mb-4 text-center">
          Your one stop for crypto payroll management.
          <br />
          Please connect your Ethereum wallet to proceed.
        </div>
        <ConnectButton large className="mx-auto d-block" />
      </InnerCard>
    </div>
  );

  const renderCompanyName = () => (
    <div>
      <StepHeader>
        <Button
          iconOnly
          onClick={() => console.log("back")}
          style={{ padding: "16px 36px" }}
        >
          <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
        </Button>
        <StepDetails>
          <div>
            <h3 className="title">Sign Up</h3>
            <p className="next">NEXT: Owner Address</p>
          </div>
          <div className="step-progress">
            <CircularProgress current={1} max={4} color="#7367f0" />
          </div>
        </StepDetails>
      </StepHeader>
    </div>
  );

  return (
    <Background withImage minHeight="92vh">
      <Container>
        <Card className="mx-auto" style={{ backgroundColor: "#fff" }}>
          {step === STEPS.ZERO && renderConnect()}
          {step === STEPS.ONE && renderCompanyName()}
          {/* <div>
            {hasSigned ? (
              <div>
                <InnerCard height="80px" disabled>
                  <div className="row justify-content-between align-items-center mx-2">
                    <div>Authorization</div>
                    <div className="my-3">Successful</div>
                  </div>
                </InnerCard>
                <InnerCard height="420px">
                  <div className="my-2">
                    Please enter the details and create the Gnosis Safe:
                  </div>
                  <CreateSafeForm />
                </InnerCard>
              </div>
            ) : (
              <InnerCard height="500px">
                <div className="my-4">
                  Please sign this message using your private key and authorize
                  Parcel.
                </div>
                <SignButton
                  setSign={setSign}
                  large
                  className="mx-auto d-block mt-3"
                />
              </InnerCard>
            )}
          </div> */}
        </Card>
      </Container>
    </Background>
  );
};

export default Register;
