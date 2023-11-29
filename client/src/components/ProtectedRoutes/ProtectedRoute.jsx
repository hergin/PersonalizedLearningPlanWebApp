import { Navigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useUser().user.accessToken !== "";

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" />;
};
export default PrivateRoute;
