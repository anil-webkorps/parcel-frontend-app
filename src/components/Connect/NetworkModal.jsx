import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { Modal, ModalBody } from "reactstrap";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import OopsPNG from "assets/images/oops.png";

const requiredNetworkId = process.env.REACT_APP_CHAIN_ID;

const NetworkModal = (props) => {
  const { active, chainId } = useWeb3React();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (active && chainId !== Number(requiredNetworkId)) setShow(true);
    else setShow(false);
  }, [chainId, active]);
  return (
    <Modal isOpen={show} centered>
      <ModalBody>
        <div className="text-center">
          <div className="pb-4">
            <img src={OopsPNG} alt="error" height="100" />
          </div>
          <h1 className="pb-3">Your MetaMask is on different network!</h1>
          <div>
            Simply select "
            {findNetworkNameByWeb3ChainId(Number(requiredNetworkId))}" to
            continue.
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default NetworkModal;
