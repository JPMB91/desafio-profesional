import { NavLink } from "react-router-dom";
import { FaCar, FaUsers, FaPlus, FaList, FaCog } from "react-icons/fa";
import { useDesktop } from "../../context/Desktop.context";

export const AdminPanel = () => {

  const {isDesktop} = useDesktop()

  if(!isDesktop){
    return (
      null
    )
  }else
  return (
       <div className="fixed left-0 w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="flex-1 mt-4">
        <NavItem to="add-vehiculo" icon={<FaPlus />} label="Agregar Vehículo" />
        <NavItem
          to="lista-vehiculos"
          icon={<FaCar />}
          label="Lista Vehículos"
        />
        <NavItem to="listar-usuarios" icon={<FaUsers />} label="Administrar Usuarios" />
        <NavItem
          to="listar-caracteristicas"
          icon={<FaList />}
          label="Características"
        />
      </nav>
    </div>
    // </main>
   
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
