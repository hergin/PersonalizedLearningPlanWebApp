import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../features/login/hooks/useUser";
import { ROLES } from "../types";

export default function AdminRoute() {
  const { user } = useUser();
  const isAdmin = user.role === ROLES.ADMIN;
  return isAdmin ? (<Outlet />) : (<Navigate to="/" replace />);
}
