import { NavLink } from "react-router-dom";
import { useDesktop } from "../../context/Desktop.Context";
import {
  CarFront,
  ClipboardList,
  FilePlus,
  Plus,
  UsersRound,
} from "lucide-react";

export const AdminPanel = () => {
  const { isDesktop } = useDesktop();

  if (!isDesktop) {
    return null;
  } else
    return (
      <div className="left-0 w-fit bg-gray-900 text-white flex flex-col h-sc border border-blue-900 ">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="flex-1 mt-4">
          <NavItem to="add-vehiculo" icon={<Plus />} label="Agregar Vehículo" />
          <NavItem
            to="lista-vehiculos"
            icon={<CarFront />}
            label="Lista Vehículos"
          />
          <NavItem
            to="listar-usuarios"
            icon={<UsersRound />}
            label="Administrar Usuarios"
          />
          <NavItem
            to="listar-caracteristicas"
            icon={<ClipboardList />}
            label="Administrar Características"
          />
          {/* <NavItem
            to="agregar-categoria"
            icon={<FilePlus />}
            label="Agregar Categoría"
          /> */}
          <NavItem
            to="listar-categorias"
            icon={<FilePlus />}
            label="Administrar categorías"
          />
        </nav>
      </div>
    );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 hover:bg-gray-700 transition ${
          isActive ? "bg-gray-800 font-semibold" : ""
        }`
      }
    >
      <span className="mr-3 text-lg">{icon}</span>
      {label}
    </NavLink>
  );
};
