import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    localStorage.setItem("token", token || "");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error: Error decodificando token");
        setToken(null);
      }
    } else {
      setUser(null);
    }
  }, [isAuthenticated, token]);

  const login = (newToken) => {
    setToken(newToken);
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, token, login, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

