import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UncontrolledTooltip } from "reactstrap";
import copy from "copy-to-clipboard";
import CopyIcon from "assets/icons/dashboard/copy-icon.svg";
import Img from "../Img";

export default function CopyButton({ id, value, tooltip, ...passThrough }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    if (copied) {
      timer = setTimeout(() => setCopied(false), 1500);
    }

    return () => clearTimeout(timer);
  }, [copied]);

  // TODO: Debounce the onClickCopy function
  const onClickCopy = useCallback(() => {
    copy(value);
    setCopied(true);
  }, [value]);

  return (
    <div className="position-relative">
      <Img
        src={CopyIcon}
        id={id}
        alt="copy"
        onClick={onClickCopy}
        width="14"
        style={{ cursor: "pointer" }}
        {...passThrough}
      />
      {/* <UncontrolledTooltip placement="top" target={id}>
        {copied
          ? `Copied ${tooltip || ""}`.trimRight()
          : `Copy ${tooltip || ""}`.trimRight()}
      </UncontrolledTooltip> */}
    </div>
  );
}

CopyButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
