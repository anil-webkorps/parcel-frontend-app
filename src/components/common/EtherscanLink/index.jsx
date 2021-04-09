import React from "react";
import PropTypes from "prop-types";
import { UncontrolledTooltip } from "reactstrap";
import LinkIcon from "assets/icons/dashboard/link-icon.svg";
import Img from "../Img";
import { getEtherscanLink } from "../Web3Utils";
import { useActiveWeb3React } from "hooks";

export default function EtherscanLink({
  id,
  type,
  address,
  hash,
  ...passThrough
}) {
  const { chainId } = useActiveWeb3React();

  return (
    <div className="position-relative">
      <a
        href={getEtherscanLink({ chainId, type, address, hash })}
        rel="noopener noreferrer"
        target="_blank"
      >
        <Img src={LinkIcon} id={id} alt="link" {...passThrough} width="14" />
        {/* <UncontrolledTooltip placement="top" target={id}>
          View on Etherscan
        </UncontrolledTooltip> */}
      </a>
    </div>
  );
}

EtherscanLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  address: PropTypes.string,
  hash: PropTypes.string,
};
