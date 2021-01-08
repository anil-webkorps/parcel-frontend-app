// import React from "react";
import { useRef } from "react";
import { useAuth } from "hooks";
import { useHistory } from "react-router-dom";
import Loading from "components/common/Loading";

export default function Authenticated({ children }) {
  const isAuthenticated = useAuth();
  const authRef = useRef();
  const history = useHistory();

  authRef.current = isAuthenticated;

  const redirectAfterDelay = () => {
    setTimeout(() => {
      if (!authRef.current) {
        history.push("/");
      }
      return children;
    }, 3000);

    return <Loading />;
  };

  return isAuthenticated ? children : redirectAfterDelay();
}
