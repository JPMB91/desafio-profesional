export const LogoutButton = ({ handleLogout }) => {
  return (
    <button
      className="bg-red-400 p-1.5 rounded-2xl mt-2 text-sm font-medium"
      type="button"
      onClick={handleLogout}
    >
      Cerrar sesión
    </button>
  );
};