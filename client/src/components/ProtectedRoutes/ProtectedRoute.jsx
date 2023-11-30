import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const PrivateRoute = () => {
  const { user } = useUser();
  console.log(`Access Token: ${user.accessToken}`);
  const isAuthenticated = user.accessToken !== "";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateRoute;
