import { Link } from "react-router-dom";
import { useDesktop } from "../context/Desktop.context";
import DesktopOnly from "../Components/DesktopOnly";

export const AdminPanel = () => {
  const { isDesktop } = useDesktop();

  return !isDesktop ? (
    <DesktopOnly />
  ) : (
    <div className="flex justify-center m-2 alig font-black justify-items-center gap-4">
      <Link to="/administracion/add-vehiculo">
        <button className="py-2 px-2 bg-blue-900 rounded hover:cursor-pointer hover:bg-blue-700">
          Add Vehiculo
        </button>
      </Link>

      <Link to="/administracion/lista-vehiculos">
        <button className="py-2 px-2 bg-blue-900 rounded hover:cursor-pointer hover:bg-blue-700">
          Lista de Vehiculos
        </button>
      </Link>
    </div>
  );
};
