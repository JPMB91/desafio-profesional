import { Navigate } from "react-router-dom";


import { useAuth } from "../../../context/Auth.Context";
import { LoadingSpinner } from "../../UI/LoadingSpinner";


export const AdminFilter = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // if (!isAuthenticated || !hasRole("ROLE_ADMIN")) {
  if(!isAuthenticated || !user.roles.includes("ROLE_ADMIN")){
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
