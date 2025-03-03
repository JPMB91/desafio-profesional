import { Link } from "react-router-dom";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/Auth.Context";

import { jwtDecode } from "jwt-decode";
import { useDesktop } from "../../context/Desktop.Context";
import { UserLogoutButton } from "../UserLogoutButton/UserLogoutButton";


export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
    const { isDesktop } = useDesktop();
 
  const handleLogout = () => {
    logout();
  };
 
  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white w-full p-2 box-border">
      <div className="sm:flex-col">
        <Link to="/" className="flex items-center gap-1">
          <img
            className="w-36 md:w-30"
            src="/src/assets/images/logo.png"
            alt="Logo Aurora Motors"
          />
          {isDesktop ?(
             <span className="font-bold text-lg md:text-xl">
             Muevete con Confianza
           </span>
          ): null}
         
        </Link>
      </div>
      {!isAuthenticated ? (
        <nav className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
          <Link to="/register">
            <button className="px-4 py-2 border border-transparent rounded bg-transparent text-white font-semibold cursor-pointer">
              Crear Cuenta
            </button>
          </Link>
          <Link to="/login">
            <button className="px-4 py-2 border border-transparent rounded bg-transparent text-white font-semibold cursor-pointer">
              Iniciar sesión
            </button>
          </Link>
        </nav>
      ) : (
        <div className="flex items-center justify-items-end gap-8">
          <div className="text-left">
            <p className="text-sm md:text-base align-bottom">Bienvenido/a:</p>
            <p className="font-medium text-base md:text-lg">{getUserName()}</p>
          </div>
          <div className="flex flex-col items-center">
            <UserAvatar />
            <UserLogoutButton handleLogout={handleLogout} />
          </div>
        </div>
      )}
    </header>
  );
};

function getUserName() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const decodedToken = jwtDecode(token);
    return decodedToken.name || "";
  } catch (error) {
    return "";
  }
}