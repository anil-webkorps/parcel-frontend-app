import React from "react";
import { StatusCircle } from "./styles";

export default function StatusText({ status }) {
  switch (status) {
    case 0:
      return (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ width: "110px" }}
        >
          <div>Completed</div>
          <StatusCircle color="#3bd800" />
        </div>
      );

    case 1:
      return (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ width: "110px" }}
        >
          <div>Pending</div>
          <StatusCircle color="#f7e72e" />
        </div>
      );

    case 2:
      return (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ width: "110px" }}
        >
          <div>Failed</div>
          <StatusCircle color="#f71ea3" />
        </div>
      );

    default:
      return null;
  }
}
