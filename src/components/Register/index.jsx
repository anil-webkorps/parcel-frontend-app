import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import CreateSafeButton from "./CreateSafeButton";
import SignButton from "./SignButton";

import { Background, InnerCard, Image } from "./styles";

const Register = () => {
  const [isConnected, setIsConnected] = useState(null);

  const { active } = useActiveWeb3React();

  useEffect(() => {
    setIsConnected(active);
  }, [active]);

  return (
    <Background backgroundColor="#F2F2F2" minHeight="92vh">
      <Container>
        {isConnected ? (
          <div>
            <Card className="mx-auto">
              <Image minHeight="323px" />
              <InnerCard>
                <div className="mb-4">
                  Please Sign the terms and conditions before continuing...
                </div>
                <SignButton />
                <div className="mt-4 mb-3">
                  You need to create a Gnosis safe:
                </div>
                <CreateSafeButton />
              </InnerCard>
            </Card>
          </div>
        ) : (
          <div>
            <Card className="mx-auto">
              <Image minHeight="323px" />
              <InnerCard>
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
