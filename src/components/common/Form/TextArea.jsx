import React from "react";

import { TextArea } from "./styles";

const TextAreaField = ({
  name,
  register,
  required,
  pattern,
  cols,
  rows,
  ...rest
}) => (
  <>
    <TextArea
      name={name}
      ref={register({ required, pattern })}
      cols={cols}
      rows={rows}
      {...rest}
    />
  </>
);

export default TextAreaField;
