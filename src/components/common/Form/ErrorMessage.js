import React from "react";
import { isEmpty } from "lodash";

import { Error } from "./styles";

const ErrorMessage = ({ errors, name, ...rest }) => {
  if (isEmpty(errors)) return null;
  return (
    <>
      <Error name={name} {...rest}>
        {errors[name]
          ? errors[name].message || "Please check your input"
          : null}
      </Error>
    </>
  );
};

export default ErrorMessage;
