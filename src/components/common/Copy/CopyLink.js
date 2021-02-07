import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UncontrolledTooltip } from "reactstrap";
import copy from "copy-to-clipboard";

export default function CopyLink({
  id,
  value,
  tooltip,
  color = "#fff",
  children,
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
    <div className="position-relative">
      <div id={id} onClick={onClickCopy} {...passThrough}>
        {children}
      </div>
      <UncontrolledTooltip placement="top" target={id}>
        {copied
          ? `Copied ${tooltip || ""}`.trimRight()
          : `Copy ${tooltip || ""}`.trimRight()}
      </UncontrolledTooltip>
    </div>
  );
}

CopyLink.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tooltip: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
