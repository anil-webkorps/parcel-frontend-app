import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import CreateSafeForm from "./CreateSafeForm";
import SignButton from "../AuthorizeButton";
import { useInjectReducer } from "utils/injectReducer";
import reducer from "store/registerWizard/reducer";
import { Background, InnerCard, Image, ScrollText } from "./styles";
import { makeSelectStep } from "store/registerWizard/selectors";
import { chooseStep } from "store/registerWizard/actions";

const key = "registerWizard";
const Register = () => {
  const [hasSigned, setHasSigned] = useState(false);
  const [sign, setSign] = useLocalStorage("SIGNATURE");

  const { active } = useActiveWeb3React();

  useInjectReducer({ key, reducer });

  const dispatch = useDispatch();
  const step = useSelector(makeSelectStep());

  useEffect(() => {
    if (active && step === 1) dispatch(chooseStep(step + 1));
    if (!active) dispatch(chooseStep(1));
  }, [active, dispatch, step]);

  // const sign = useMemo(() => sign, [sign]);

  useEffect(() => {
    if (sign && sign[0] && active) {
      console.log({ sign });
      setHasSigned(true);
    }
  }, [active, sign]);

  const renderConnect = () => (
    <div>
      <Card className="mx-auto">
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
      </Card>
    </div>
  );

  return (
    <Background withImage minHeight="92vh">
      <Container>
        {step === 1 && renderConnect()}
        {step === 2 && (
          <div>
            <Card className="mx-auto">
              {/* <Image minHeight="323px" /> */}
              <InnerCard height="80px" disabled>
                <div className="row justify-content-between align-items-center mx-2">
                  <div>Login</div>
                  <div className="my-3">Successful</div>
                </div>
              </InnerCard>
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
                    Please sign this message using your private key and
                    authorize Parcel.
                  </div>
                  <ScrollText>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Praesent consectetur orci erat, vitae porttitor dui
                      pulvinar at. Curabitur tincidunt est in condimentum
                      congue. Mauris pellentesque elit ac diam lacinia
                      dignissim. Nulla quam lacus, ultrices eu blandit at,
                      molestie at nisl. Pellentesque nisi neque, sollicitudin
                      sit amet neque sed, posuere consectetur felis. Vestibulum
                      vitae porta elit. Suspendisse sagittis luctus sem sit amet
                      aliquet. Mauris dolor est, luctus vel dui id, lacinia
                      consequat elit.
                    </p>
                    <p>
                      Proin cursus tortor vel pellentesque viverra. Pellentesque
                      pulvinar justo nunc, vel condimentum ex laoreet in. Nulla
                      facilisi. Duis rhoncus vestibulum elementum. Donec semper
                      posuere justo mollis viverra. In tellus erat, imperdiet
                      nec eros sit amet, sollicitudin fringilla turpis. Fusce id
                      congue augue. Phasellus consectetur diam in interdum
                      ornare. Sed eu viverra dolor, a lacinia felis.
                    </p>
                    <p>
                      Pellentesque pretium eros nec elementum vehicula. Maecenas
                      imperdiet orci non magna aliquam, eu eleifend ipsum
                      egestas. Nulla vel elit ipsum. Nulla fermentum turpis
                      orci. Nullam at tincidunt lacus. Aenean blandit ligula ut
                      accumsan tristique. Proin laoreet eu ligula consectetur
                      dapibus. Morbi pretium vel augue eget pretium.
                      Pellentesque sed tempus eros, sit amet eleifend mauris.
                      Integer non posuere orci. Nam consequat, leo a consequat
                      pharetra, sapien dui elementum tortor, ut efficitur felis
                      tortor at eros. Fusce fringilla enim sed tellus gravida
                      pharetra. Phasellus ultricies dictum mi vel tempus.
                      Quisque fringilla ante feugiat leo gravida, sed dictum
                      sapien euismod. Suspendisse hendrerit risus sed eros
                      gravida, a lacinia felis accumsan.
                    </p>
                  </ScrollText>
                  <SignButton
                    setSign={setSign}
                    large
                    className="mx-auto d-block mt-3"
                  />
                </InnerCard>
              )}
            </Card>
          </div>
        )}
      </Container>
    </Background>
  );
};

export default Register;
