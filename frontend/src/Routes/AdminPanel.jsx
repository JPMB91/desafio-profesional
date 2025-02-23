import { Link } from "react-router-dom";
import { useDesktop } from "../context/Desktop.context";
import DesktopOnly from "../Components/DesktopOnly";
import { useAuth } from "../context/Auth.Context";

export const AdminPanel = () => {
  const { isDesktop } = useDesktop();
  const {isAuthenticated, user} = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // if (!user || !user.roles.includes("ROLE_ADMIN")) {
  //   return <Navigate to="/unauthorized" />;
  // }

  return !isDesktop ? (
    <DesktopOnly />
  ) : (
    <div className="flex justify-center m-2 alig font-black justify-items-center gap-4">
      <Link to="/administracion/add-vehiculo">
        <button className="py-2 px-2 bg-[#0076DC] rounded hover:cursor-pointer hover:bg-blue-700 border-blue-900">
          Add Vehiculo
        </button>
      </Link>

      <Link to="/administracion/lista-vehiculos">
        <button className="py-2 px-2 bg-[#0076DC] rounded hover:cursor-pointer hover:bg-blue-700 border-blue-900">
          Lista de Vehiculos
        </button>
      </Link>
    </div>
  );
};
