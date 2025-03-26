import { LogOut } from "lucide-react";

export const UserLogoutButton = ({ handleLogout }) => {
  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200 flex items-center gap-2 w-fit"
      type="button"
      onClick={handleLogout}
    >
      <LogOut size={18} />
      <span className="font-medium">Salir</span>
    </button>
  );
};
