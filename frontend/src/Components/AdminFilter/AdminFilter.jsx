import { Navigate } from "react-router-dom";

import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "../../context/Auth.Context";

export const AdminFilter = ({ children }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || !hasRole("ROLE_ADMIN")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
