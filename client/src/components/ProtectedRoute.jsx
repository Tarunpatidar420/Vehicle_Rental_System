

import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();

  //   login check
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
