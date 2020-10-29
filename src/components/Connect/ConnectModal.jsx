import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalHeader, ModalBody } from "reactstrap";
// import LoadingSpinner from "components/common/loading-spinner";
import { supportedWallets } from "constants/index";
import { getErrorMessage } from "utils/web3-helpers";

import { Card } from "./styles";

const ConnectToWalletModal = (props) => {
  const { connector, activate, active, error, setError } = useWeb3React();
  const [showInfo, setShowInfo] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(null);
  const { handleToggle, show } = props;

  useEffect(() => {
    if (connector && active && !error) {
      console.log("Successfully connected");
      handleToggle();
    }
  }, [selectedConnector, connector, active, error, handleToggle]);

  const activateWallet = (connector) => {
    setError(null);
    activate(connector);
    setSelectedConnector(connector);
  };

  return (
    <Modal isOpen={show} centered>
      <ModalHeader toggle={handleToggle}>
        <div>Select a Wallet to Connect to Parcel</div>
      </ModalHeader>
      <ModalBody>
        {supportedWallets.map(({ id, name, icon, connector }) => (
          <div key={id}>
            <Card onClick={() => activateWallet(connector)}>
              <div>
                <img src={icon} alt={name} />
              </div>

              <div className="ml-3">{name}</div>

              {selectedConnector === connector && !error && !active && (
                <span className="ml-4">Loading...</span>
              )}
            </Card>
          </div>
        ))}
        {error && (
          <div className="alert alert-danger mt-4">
            {getErrorMessage(error)}
          </div>
        )}

        <div onClick={() => setShowInfo(!showInfo)} className="mt-4">
          What is a wallet?
        </div>
        {showInfo && (
          <div>
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

export default ConnectToWalletModal;
