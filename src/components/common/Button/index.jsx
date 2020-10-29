import { Link } from "react-router-dom";

import { Button } from "./styles";

const CustomButton = ({ children, className, to, href, ...rest }) => {
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

  return (
    <Button className={className} {...rest}>
      {children}
    </Button>
  );
};

export default CustomButton;
