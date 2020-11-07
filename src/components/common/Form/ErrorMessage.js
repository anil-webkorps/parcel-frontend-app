import React from "react";
import { isEmpty } from "lodash";

import { Error } from "./styles";

const ErrorMessage = ({ errors, name, ...rest }) => {
  if (isEmpty(errors)) return null;
  console.log({ inside: errors[name], errors, name });
  return (
    <>
      <Error name={name} {...rest}>
        {(errors[name] && errors[name].message) || "Please check your input"}
      </Error>
    </>
  );
};

export default ErrorMessage;
