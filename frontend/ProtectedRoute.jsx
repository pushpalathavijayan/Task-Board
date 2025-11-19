import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  if (!user || !user.token) return <Navigate to="/" replace />;
  return children;
}
