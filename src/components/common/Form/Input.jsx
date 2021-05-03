import React from "react";

import { Input } from "./styles";

const InputField = ({
  name,
  id,
  label,
  register,
  required,
  pattern,
  type,
  labelStyle = {},
  ...rest
}) => {
  return(
    <>
      <Input
        name={name}
        id={id || name}
        ref={register({ required, pattern })}
        type={type}
        {...rest}
      />
      {label ? (
        <label htmlFor={id || name} style={labelStyle}>
          {label}
        </label>
      ) : null}
    </>
  );
}

export default InputField;
