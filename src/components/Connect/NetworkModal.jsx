import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalBody } from "reactstrap";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import OopsPNG from "assets/images/oops.png";

const requiredNetworkName = process.env.REACT_APP_NETWORK_NAME;

const NetworkModal = () => {
  const { active, chainId } = useWeb3React();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active && findNetworkNameByWeb3ChainId(chainId) !== requiredNetworkName)
      setShow(true);
    else setShow(false);
  }, [chainId, active]);
  return (
    <Modal isOpen={show} centered>
      <ModalBody>
        <div className="text-center">
          <div className="pb-4">
            <img src={OopsPNG} alt="error" height="100" />
          </div>
          <h1 className="pb-3">Your wallet is on different network!</h1>
          <div>Simply select "{requiredNetworkName}" to continue.</div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NetworkModal;
