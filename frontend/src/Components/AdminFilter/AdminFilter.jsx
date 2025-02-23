// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/Auth.Context";

// export const AdminFilter = ({ children }) => {
//   const { isAuthenticated, user } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//   try {
//     if (!user || !user.roles.includes("ROLE_ADMIN")) {
//       return <Navigate to="/unauthorized" />;
//     }
//     return <Outlet />;
//   } catch (error) {
//     return <Navigate to="/login" />;
//   }
// };
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Auth.Context";

export const AdminFilter = () => {
  const { isAuthenticated, user } = useAuth();



  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // if (!user || !user.roles.includes("ROLE_ADMIN")) {
  //   return <Navigate to="/unauthorized" />;
  // }


  // if (user.roles !== "ROLE_ADMIN") {
  //   return <Navigate to="/unauthorized" />;
  // }
  return <Outlet />;
};