import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../features/login/hooks/useUser";

function ProtectedRoute() {
  const { user } = useUser();
  const location = useLocation();
  const isAuthenticated = user.accessToken !== "";
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
