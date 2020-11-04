import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import CreateSafeForm from "./CreateSafeForm";
import SignButton from "./SignButton";

import { Background, InnerCard, Image, ScrollText } from "./styles";

const Register = () => {
  const [isConnected, setIsConnected] = useState(null);
  const [hasSigned, setHasSigned] = useState(false);
  const [sign, setSign] = useLocalStorage("SIGNATURE");

  const { active } = useActiveWeb3React();

  useEffect(() => {
    setIsConnected(active);
  }, [active]);

  // const sign = useMemo(() => sign, [sign]);

  useEffect(() => {
    if (sign && sign[0] && active) {
      console.log({ sign });
      setHasSigned(true);
    }
  }, [active, sign]);

  return (
    <Background withImage minHeight="92vh">
      <Container>
        {isConnected ? (
          <div>
            <Card className="mx-auto">
              {/* <Image minHeight="323px" /> */}
              <InnerCard height="100px" disabled>
                <div className="row justify-content-between align-items-center mx-2">
                  <div>Login</div>
                  <div className="mt-4 mb-3">Success</div>
                </div>
              </InnerCard>
              {hasSigned ? (
                <div>
                  <InnerCard height="100px" disabled>
                    <div className="row justify-content-between align-items-center mx-2">
                      <div>Signed</div>
                      <div className="mt-4 mb-3">Success</div>
                    </div>
                  </InnerCard>
                  <InnerCard height="380px">
                    <div className="mt-4 mb-3">
                      You need to create a Gnosis safe:
                    </div>
                    <CreateSafeForm />
                  </InnerCard>
                </div>
              ) : (
                <InnerCard height="480px">
                  <div className="mb-4">
                    Please Sign the terms and conditions before continuing...
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
                  <SignButton setSign={setSign} />
                </InnerCard>
              )}
            </Card>
          </div>
        ) : (
          <div>
            <Card className="mx-auto">
              <Image minHeight="323px" />
              <InnerCard height="257px">
                <h2>Hey there</h2>
                <div className="mb-4">
                  Please connect your Ethereum wallet to proceed.
                </div>
                <ConnectButton />
              </InnerCard>
            </Card>
          </div>
        )}
      </Container>
    </Background>
  );
};

export default Register;
