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
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        //actualizo el estado
        setUserData(prevUsers => prevUsers.map(u => u.id === user.id ? response.data : u));

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Rol Actualizado',
            timer: "500"
        })

    } catch (error) {
        console.error("Error actualizando el rol:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al actualizar el rol.',
        });
    }
};
  // const handleDelete = async (userId) => {
  //   const confirmDelete = Swal.mixin({
  //     customClass: {
  //       confirmButton:
  //         "bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-2 rounded mr-4",
  //       cancelButton:
  //         "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-2 rounded",
  //     },
  //     buttonsStyling: false,
  //   });

  //   try {
  //     const result = await confirmDelete.fire({
  //       title: "¿Desea borrar el usuario?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Borrar Usuario",
  //       cancelButtonText: "Cancelar",
  //     });

  //     if (result.isConfirmed) {
  //       await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       setUserData((prevData) =>
  //         prevData.filter((user) => user.id !== userId)
  //       );

  //       await confirmDelete.fire({
  //         title: "Borrado",
  //         text: "El usuario ha sido eliminado",
  //         icon: "success",
  //         timer: 1500,
  //         showConfirmButton: false,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error al borrar el usuario:", error);
  //     confirmDelete.fire({
  //       title: "Cancelado",
  //       text: "El borrado ha sido cancelado",
  //       icon: "warning",
  //       timer: 1500,
  //     });
  //   }
  // };

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

                  {/* {user.roles.length > 0 ? user.roles.join(", ") : "Sin rol"} */}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {`${user.firstName} ${user.lastName}`}
                </td>

                <td className="py-2 px-4 border border-gray-300">
                  {`${user.email}`}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {/* <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button> */}

                 
                    <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded m-1"  onClick={() => handleRoleChange(user)}>
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
