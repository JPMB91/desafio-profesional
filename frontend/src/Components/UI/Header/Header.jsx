import { Link } from "react-router-dom";


import { Calendar, Heart, Home, Menu, User, X } from "lucide-react";
import { useState } from "react";

import { useAuth } from "../../../context/Auth.Context";
import { useDesktop } from "../../../context/Desktop.Context";
import { getUserName } from "../../../utils/getUsername";
import { UserAvatar } from "../../User/UserAvatar/UserAvatar";
import { UserLogoutButton } from "../../User/UserLogoutButton/UserLogoutButton";

export const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDesktop } = useDesktop()

  const [menuOpen, setMenuOpen] = useState(false);

  const name = getUserName();

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header
      className="flex flex-col md:flex-row justify-between bg-gradient-to-r from-gray-900 via-gray-800
to-gray-700 text-white p-3 box-border "
    >
      <div className="flex flex-col sm:flex-col md:flex-col">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="flex flex-col md:flex-col lg:flex-row items-center gap-1"
          >
            <img
              className="w-36 md:w-30"
              src="/src/assets/images/logo.png"
              alt="Logo Aurora Motors"
            />
            <span className="font-semibold lg:text-lg md:text-sm">
              Muevete con Confianza
            </span>
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="p-1 rounded-md block md:hidden font-bold"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* desktop */}
      <div className="hidden md:flex items-center gap-4 ">
        {isAuthenticated && user?.roles?.includes("ROLE_USER") && (
          <div className="flex gap-5 self-end lg:mr-6 ">
            <Link to="/historial-reservas">
              <div className="flex items-center gap-2 font-bold">
                <Calendar size={16} className="text-blue-600" />
                <span className="font-semibold">Historial de Reservas</span>
              </div>
            </Link>
            <Link to="/listar-favoritos">
              <div className="flex items-center gap-2 font-bold">
                <Heart size={16} className="text-blue-600" fill="#1A43BF" />
                <span className="font-semibold">Favoritos</span>
              </div>
            </Link>
          </div>
        )}

        {!isAuthenticated ? (
          <nav className="flex items-center gap-2">
            <Link to="/login">
              <button className="px-3 py-2  text-white font-semibold cursor-pointer">
                Iniciar sesión
              </button>
            </Link>
            <span className="text-gray-400">|</span>
            <Link to="/register">
              <button className="px-4 py-2  text-white font-semibold cursor-pointer">
                Crear Cuenta
              </button>
            </Link>
          </nav>
        ) : (
          <div className="flex items-center gap-4 px-3">
            <UserAvatar name={name} />
            <div className="text-left">
              <p className="text-sm md:text-base align-bottom">Hola,</p>
              <p className="font-medium text-base md:text-base">{name}</p>
            </div>
            <div className="flex items-center">
              <UserLogoutButton handleLogout={handleLogout} />
            </div>
          </div>
        )}
      </div>

      {/* mobile */}
      {menuOpen && (
        <div className="md:hidden p-2 pt-0 pb-3 border-t border-gray-700 animate-fadeIn">
          {isAuthenticated ? (
            <div className="pt-2">
              <div className="flex items-center gap-3 py-2 mb-3 border-b border-gray-700 pb-3">
                <UserAvatar name={name} />
                <div className="text-left flex-grow">
                  <p className="text-xs text-gray-300">Hola,</p>
                  <p className="font-medium">{name}</p>
                </div>
              </div>

              {user?.roles?.includes("ROLE_USER") && (
                <nav className="flex flex-col gap-2">
                  <Link
                    key="favoritos"
                    to="/listar-favoritos"
                    onClick={() => setMenuOpen(false)}
                    className="w-full"
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors bg-blue-500 hover:bg-blue-600 text-white`}
                    >
                      <Heart size={18} />
                      <span>Favoritos</span>
                    </div>
                  </Link>

                  <Link
                    key="historial"
                    to="/historial-reservas"
                    onClick={() => setMenuOpen(false)}
                    className="w-full"
                  >
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors bg-gray-700 hover:bg-gray-600 text-white`}
                    >
                      <Calendar size={18} />
                      <span>Historial de Reservas</span>
                    </div>
                  </Link>

                  <div className="mt-3 pt-2 border-t border-gray-700 flex sm: justify-end">
                    <UserLogoutButton handleLogout={handleLogout} />
                  </div>
                </nav>
              )}
            </div>
          ) : (
            <nav className="flex flex-col gap-2 pt-2">
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium flex items-center gap-2">
                  <User size={18} />
                  <span>Crear Cuenta</span>
                </button>
              </Link>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium flex items-center gap-2">
                  <User size={18} />
                  <span>Iniciar sesión</span>
                </button>
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                <button className="w-full text-left p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-white font-medium flex items-center gap-2">
                  <Home size={18} />
                  <span>Inicio</span>
                </button>
              </Link>
            </nav>
          )}
        </div>
      )}
    </header>
  );
};
