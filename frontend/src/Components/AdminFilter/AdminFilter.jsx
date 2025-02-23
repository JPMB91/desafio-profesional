import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.Context";
import { LoadingSpinner } from "../LoadingSpinner";

export const AdminFilter = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if(loading){
    return <LoadingSpinner />
  }
  
  if (!isAuthenticated || !user || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

