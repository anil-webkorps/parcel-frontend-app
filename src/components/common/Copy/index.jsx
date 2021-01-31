import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UncontrolledTooltip } from "reactstrap";
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function CopyButton({
  id,
  value,
  tooltip,
  color = "#fff",
  ...passThrough
}) {
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
    <div>
      <FontAwesomeIcon
        id={id}
        onClick={onClickCopy}
        icon={faCopy}
        color={color}
        {...passThrough}
      />
      <UncontrolledTooltip placement="top" target={id}>
        {copied
          ? `Copied ${tooltip || ""}`.trimRight()
          : `Copy ${tooltip || ""}`.trimRight()}
      </UncontrolledTooltip>
    </div>
  );
}

CopyButton.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
