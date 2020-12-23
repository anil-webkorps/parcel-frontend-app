import React from "react";
import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { startCase } from "lodash";

import { Account } from "components/common/Web3Utils";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import ConnectToWalletModal from "./ConnectModal";
// import NetworkModal from "./NetworkModal";
import Button from "components/common/Button";

const ConnectToWallet = ({ className, ...rest }) => {
  const { chainId, active } = useWeb3React();

  const handleClick = () => {
    if (!active) setShow(true);
  };

  const getNetworkName = () => {
    return startCase(findNetworkNameByWeb3ChainId(chainId));
  };

  const [show, setShow] = useState(false);

  const handleToggle = () => setShow(false);

  return (
    <div>
      <Button
        type="button"
        onClick={handleClick}
        className={className}
        {...rest}
      >
        {!active ? (
          <span>Connect</span>
        ) : (
          <span>
            {getNetworkName()} <Account />
          </span>
        )}
      </Button>
      <ConnectToWalletModal show={show} handleToggle={handleToggle} />
      {/* <NetworkModal /> */}
    </div>
  );
};

export default ConnectToWallet;
