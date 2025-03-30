import { useEffect, useState } from "react";

import { useDesktop } from "../../../context/Desktop.Context";
import { LoadingSpinner } from "../../UI/LoadingSpinner";
import DesktopOnly from "../../UI/DesktopOnly";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "../../../context/Auth.Context";

export const UserTable = () => {
  const { isDesktop } = useDesktop();
  const { token, user } = useAuth();

  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(true);
      }
    };

    getUserData();
  }, [token, user]);

  const handleRoleChange = async (user) => {
    const currentRoleId = user.roles.values().next().value.id;
    // si tiene rol id 1 entonces cambia a 2
    const newRoleId = currentRoleId === 1 ? 2 : 1;

    try {
      const response = await axios.put(
        `http://localhost:8080/admin/users/updateRole?id=${user.id}`,
        newRoleId,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //actualizo el estado
      setUserData((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? response.data : u))
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Rol Actualizado",
        timer: "500",
      });
    } catch (error) {
      console.error("Error actualizando el rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar el rol.",
      });
    }
  };
  
  if (!isDesktop) return <DesktopOnly />;
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios Registrados</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-2 px-4 border border-gray-300">
                Rol
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Nombre
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Email
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {user.roles.length > 0
                    ? user.roles.map((role) => role.name).join(", ")
                    : "Sin rol"}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {`${user.firstName} ${user.lastName}`}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {`${user.email}`}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded m-1"
                    onClick={() => handleRoleChange(user)}
                  >
                    Actualizar Permisos
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
