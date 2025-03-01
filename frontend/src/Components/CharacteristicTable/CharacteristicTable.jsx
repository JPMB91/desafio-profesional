import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import Swal from "sweetalert2";

export const CharacteristicTable = () => {
  const [characteristics, setCharacteristics] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  const getCharacteristics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/characteristics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCharacteristics(response.data);
    } catch (error) {
      console.error("Error obteniendo caracteristicas", error);
    }
  };

  useEffect(() => {
    getCharacteristics();
  }, [token]);

  const handleAddCharacteristic = () => {
    navigate("/administracion/agregar-caracteristica");
  };

  const handleDelete = async (characteristicId) => {
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
        title: "¿Desea borrar la característica?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar Característica",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/characteristics/${characteristicId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCharacteristics(characteristics.filter((c) => c.id !== characteristicId));

        await confirmDelete.fire({
          title: "Borrado",
          text: "Característica borrada",
          icon: "success",
          timer: "1500",
          className: "py-1 px-2 rounded",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error borrando la característica: ", error);
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
        onClick={handleAddCharacteristic}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Crear nueva Caracteristica
      </button>
      <h1 className="text-2xl font-bold mb-4">Lista de Características</h1>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-2 px-4 border border-gray-300">ID</th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Nombre
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Icono
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {characteristics.map((charac) => (
              <tr key={charac.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {charac.id}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {charac.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {charac.characteristicImage && (
                    <img
                      src={`http://localhost:8080/api/characteristics/image/${charac.characteristicImage.filename}?${new Date().getTime()}`}
                      alt={`${charac.name} Image`}
                      className="h-16 w-16 object-cover"
                    />
                  )}
                </td>

                <td>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(charac.id)}
                  >
                    Eliminar
                  </button>
                  <Link to={`/administracion/actualizar-caracteristica/${charac.id}`}>
                    <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2 rounded m-1">
                      Actualizar
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};