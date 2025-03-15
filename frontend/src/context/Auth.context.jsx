import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // const hasRole = (roleName) => {
  //   return user && user.roles && user.roles.includes(roleName);
  // };

  // const isAdmin = user && user.roles && user.roles.includes("ROLE_ADMIN");
  useEffect(() => {
    localStorage.setItem("token", token || "");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch (error) {
        console.error("Error decoding token", error);
        setToken(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token, isAuthenticated]);

  const login = (newToken) => {
    setLoading(true);
    setToken(newToken);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null), setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, token, login, loading, logout}}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);