import React from "react";

import { Card } from "./styles";

export default function CustomCard({ children, ...rest }) {
  return <Card {...rest}>{children}</Card>;
}
