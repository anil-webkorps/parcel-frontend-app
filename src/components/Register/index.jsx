import React, { useState, useEffect } from "react";
import Button from "components/common/Button";
import Container from "react-bootstrap/Container";
import { useActiveWeb3React } from "hooks";
import ConnectButton from "components/Connect";
import CreateSafeButton from "./CreateSafeButton";

const Register = () => {
  const [isConnected, setIsConnected] = useState(false);

  const { active } = useActiveWeb3React();

  useEffect(() => {
    setIsConnected(active);
  }, [active]);
  return (
    <div>
      <Container style={{ marginTop: "5em" }}>
        {isConnected ? (
          <div>
            <div className="mb-4">
              Please Sign the terms and conditions before continuing...
            </div>
            <Button>Sign and Accept Terms</Button>
            <div className="mt-5 mb-4">You need to create a Gnosis safe:</div>
            <CreateSafeButton />
          </div>
        ) : (
          <div>
            <div className="mb-4">
              Please connect your Ethereum wallet before continuing...
            </div>
            <ConnectButton />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Register;
