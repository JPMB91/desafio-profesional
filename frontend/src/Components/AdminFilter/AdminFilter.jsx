import { Navigate } from "react-router-dom";

import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "../../context/Auth.Context";

export const AdminFilter = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !user || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
