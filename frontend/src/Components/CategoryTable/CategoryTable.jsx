import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.Context";
import Swal from "sweetalert2";

export const CategoryTable = () => {
  const [categories, setCategories] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error obteniendo categorías", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [token]);

  const handleAddCategory = () => {
    navigate("/administracion/agregar-categoria");
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-2 rounded mr-4",
        cancelButton:
          "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-2 rounded",
      },
      buttonsStyling: false,
    });

    try {
      const result = await confirmDelete.fire({
        title: "¿Está seguro/a?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar Categória",
        text: "Esta acción no elimina los vehiculos asociados, pero deberá reasignarlos a una nueva categoría",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        await axios.delete(
          `http://localhost:8080/api/categories/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(categories.filter((c) => c.id !== categoryId));

        await confirmDelete.fire({
          title: "Borrado",
          text: "Categoría borrada",
          icon: "success",
          timer: "1500",
          className: "py-1 px-2 rounded",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error borrando la categoría: ", error);
      confirmDelete.fire({
        title: "Cancelado",
        text: "El borrado ha sido cancelado",
        timer: "1500",
        icon: "warning",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={handleAddCategory}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Crear nueva Categoría
      </button>
      <h1 className="text-2xl font-bold mb-4">Lista de Categorías</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-2 px-4 border border-gray-300">ID</th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Nombre
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Imágen
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {category.id}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {category.name}
                </td>
                <td className="py-2 px-4 w-fit border border-gray-300">
                  {category.categoryImage && (
                    <img
                      src={`http://localhost:8080/api/categories/uploads/${category.categoryImage.filename}`}
                      alt={`${category.name} Image`}
                      className="h-16 w-16 object-cover"
                    />
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(category.id)}
                  >
                    Eliminar
                  </button>
                  {/* <Link to={`/administracion/actualizar-categoria/${category.id}`}>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded m-1">
                      Actualizar
                    </button>
                  </Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
