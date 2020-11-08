import { Link } from "react-router-dom";

import { Button } from "./styles";

const CustomButton = ({
  children,
  className,
  to,
  href,
  iconOnly,
  secondary,
  style: propStyles,
  ...rest
}) => {
  if (to) {
    return (
      <Link to={to}>
        <Button className={className} {...rest}>
          {children}
        </Button>
      </Link>
    );
  } else if (href) {
    return (
      <a href={href} rel="noopenner noreferrer" target="_blank">
        <Button className={className} {...rest}>
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
    <Button className={className} secondary={secondary} {...rest}>
      {children}
    </Button>
  );
};

export default CustomButton;
