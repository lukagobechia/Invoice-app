import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  const isTokenValid = isValidToken(token);

  if (!isTokenValid) {
    localStorage.removeItem("jwtToken");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const isValidToken = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
};

export default AuthGuard;
