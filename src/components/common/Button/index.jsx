import { Link } from "react-router-dom";

import { Button } from "./styles";
import LoadingSvg from "assets/icons/loading.svg";

const CustomButton = ({
  children,
  className,
  to,
  href,
  iconOnly,
  loading,
  style: propStyles,
  ...rest
}) => {
  if (to) {
    return (
      <Link to={to}>
        <Button className={`w-100 ${className}`} style={propStyles} {...rest}>
          {children}
        </Button>
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} rel="noopenner noreferrer" target="_blank">
        <Button className={className} style={propStyles} {...rest}>
          {children}
        </Button>
      </a>
    );
  }

  if (iconOnly) {
    return (
      <Button
        className={className}
        style={{ border: "none", background: "none", ...propStyles }}
        {...rest}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      className={`d-flex align-items-center justify-content-center ${className}`}
      style={propStyles}
      {...rest}
    >
      {children}
      {loading && (
        <img src={LoadingSvg} alt="loading" width="20" className="ml-2" />
      )}
    </Button>
  );
};

export default CustomButton;
