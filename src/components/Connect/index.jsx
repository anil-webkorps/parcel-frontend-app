import React from "react";
import { useDispatch } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { startCase } from "lodash";
import { show } from "redux-modal";

import { Account } from "components/common/Web3Utils";
import { findNetworkNameByWeb3ChainId } from "constants/networks";
import Button from "components/common/Button";
import { MODAL_NAME as CONNECT_MODAL } from "./ConnectModal";

const ConnectToWallet = ({ className, ...rest }) => {
  const { chainId, active } = useWeb3React();
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!active) dispatch(show(CONNECT_MODAL));
  };

  const getNetworkName = () => {
    return startCase(findNetworkNameByWeb3ChainId(chainId));
  };

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
    </div>
  );
};

export default ConnectToWallet;
