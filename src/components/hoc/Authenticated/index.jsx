// import React from "react";
import { useAuth } from "hooks";

export default function Authenticated({ children }) {
  const isAuthenticated = useAuth();

  return isAuthenticated && children;
}
