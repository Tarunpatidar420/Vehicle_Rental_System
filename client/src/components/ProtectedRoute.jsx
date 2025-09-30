import React from "react";
import { Navigate } from "react-router-dom";

const OWNER_EMAIL = "tarunpatidarrupariya@gmail.com";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail"); // ✅ tum login ke time save karao
  const dashboardKey = localStorage.getItem("dashboardKey");

  // ✅ Check owner condition
  if (!token || userEmail !== OWNER_EMAIL || !dashboardKey) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
