import { useState, useEffect } from "react";
// import { useWeb3React } from "@web3-react/core";
import { connectModal as reduxModal } from "redux-modal";

import { Modal, ModalHeader, ModalBody } from "reactstrap";
import Loading from "components/common/Loading";
// import { supportedWallets } from "constants/index";
import { getErrorMessage } from "utils/web3-helpers";
import { useActiveWeb3React, useInactiveListener } from "hooks/index";
import { Card, WalletContainer } from "./styles";
import { connectorsByName } from "connectors";

export const MODAL_NAME = "connect-wallet-modal";

const modalStyles = `
  .modal-dialog {
    max-width: 700px;
  }
`;

const ConnectToWalletModal = (props) => {
  const { connector, activate, error, active } = useActiveWeb3React();
  const [showInfo, setShowInfo] = useState(false);
  const { handleHide, show, triedEager } = props;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState();
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    if (connector && active && !error) {
      handleHide();
    }
  }, [connector, active, error, handleHide]);

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide}>
        <div>Select a Wallet to Connect to Parcel</div>
      </ModalHeader>
      <ModalBody>
        <WalletContainer>
          {Object.keys(connectorsByName).map((name) => {
            const { connector: currentConnector, icon } = connectorsByName[
              name
            ];
            const activating = currentConnector === activatingConnector;
            const connected = currentConnector === connector;
            const disabled =
              !triedEager || !!activatingConnector || connected || !!error;

            return (
              <Card
                style={{
                  cursor: disabled ? "unset" : "pointer",
                }}
                key={name}
                onClick={() => {
                  setActivatingConnector(currentConnector);
                  activate(currentConnector);
                }}
              >
                <div>
                  <img src={icon} alt={name} width="40px" height="40px" />
                </div>

                <div className="wallet-details">
                  <div className="wallet-name">
                    <span>{name}</span>
                    {activating && <Loading className="ml-3" color="primary" />}
                  </div>

                  {connected && <i className="wallet-selected">selected</i>}
                </div>
              </Card>
            );
          })}
        </WalletContainer>
        {error && (
          <div className="alert alert-danger mt-4">
            {getErrorMessage(error)}
          </div>
        )}

        <div
          onClick={() => setShowInfo(!showInfo)}
          className="mt-4 cursor-pointer"
          style={{ fontSize: "14px" }}
        >
          What is a wallet?
        </div>
        {showInfo && (
          <div style={{ fontSize: "14px" }}>
            Wallets are used to send, receive, and store digital assets like
            Ether. Wallets come in many forms. They are either built into your
            browser, an extension added to your browser, a piece of hardware
            plugged into your computer or even an app on your phone. For more
            information about wallets, see{" "}
            <a
              href="https://docs.ethhub.io/using-ethereum/wallets/intro-to-ethereum-wallets/"
              target="_blank"
              rel="noopenner noreferrer"
            >
              this explanation
            </a>
            .
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default reduxModal({ name: MODAL_NAME })(ConnectToWalletModal);
