export const UserLogoutButton = ({ handleLogout }) => {
  return (
    <button
      className="bg-red-500 p-2 rounded-xl mt-2 text-sm font-bold hover:cursor-pointer hover:"
      type="button"
      onClick={handleLogout}
    >
      Cerrar sesión
    </button>
  );
};