import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminGuard = () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" />; // Redirect non-admins to dashboard
    }
    return <Outlet />; // Allow access to admin routes
  } catch (e) {
    return <Navigate to="/login" />;
  }
};

export default AdminGuard;
