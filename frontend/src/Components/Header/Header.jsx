import { Link } from "react-router-dom";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import { useAuth } from "../../context/Auth.Context";


export const Header = () => {
  const { isAuthenticated, logout} = useAuth();

  const handleLogout = () =>{
    logout()
  }

  return (
    <header className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white w-full p-2 box-border">
      <div className="sm:flex-col">
        <Link to="/" className="flex items-center gap-1 ">
          <img
            className="w-36 md:w-30"
            src="/src/assets/images/logo.png"
            alt="Logo Aurora Motors"
          />
          <span className="font-bold text-lg md:text-xl">
            Muevete con Confianza
          </span>
        </Link>
      </div>

      {!isAuthenticated ? (
        <nav className="flex flex-col md:flex-row items-center gap-2 mt-2 md:mt-0">
          <Link to={"/register"}>
            <button className="px-4 py-2 border border-transparent rounded bg-transparent text-white font-semibold cursor-pointer">
              Crear Cuenta
            </button>
          </Link>
          <Link to={"/login"}>
            <button className="px-4 py-2 border border-transparent rounded bg-transparent text-white font-semibold cursor-pointer">
              Iniciar sesión
            </button>
          </Link>
        </nav>
      ) : (
       <div>
        <UserAvatar className="self-end md:self-auto ml-auto" />
        <button className="bg-red-400 p-1.5 rounded-2xl mt-0.5" type="button" onClick={handleLogout}>Cerrar sesión</button>
       </div>
        
      )}
    </header>
  );
};
