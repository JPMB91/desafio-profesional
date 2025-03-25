import { Link } from "react-router-dom";
import { useAuth } from "../../../context/Auth.Context";
import { useFavorites } from "../../../context/Favorite.Context";

export const UserFavoriteList = () => {
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Favoritos</h1>
    <table className="min-w-full table-auto border-collapse">
      <thead className="bg-gray-300">
        <tr>
          <th className="text-left py-2 px-4 border border-gray-300">Nombre</th>
          <th className="text-left py-2 px-4 border border-gray-300">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {favorites.map((fav) => (
          <tr key={fav.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border border-gray-300">
              <Link to={`/vehicle/${fav.id}`}>{fav.name}</Link></td>
            <td className="py-2 px-4 border border-gray-300">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded hover:cursor-pointer"
                onClick={() => toggleFavorite(fav)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    
  );
};
