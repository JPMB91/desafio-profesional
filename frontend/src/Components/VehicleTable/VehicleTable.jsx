import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDesktop } from "../../context/Desktop.context";
import DesktopOnly from "../DesktopOnly";
import { LoadingSpinner } from "../LoadingSpinner";
import { Link } from "react-router-dom";

export const VehicleTable = () => {
  const { isDesktop } = useDesktop();

  const [vehiclesData, setVehiclesData] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const getVehicleData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vehicles");
        setVehiclesData(response.data);
        setIsloading(false);
        console.log(vehiclesData);
      } catch (error) {
        setIsloading(true);
        console.log(error);
      }
    };
    getVehicleData();
  }, []);

  const handleDelete = async (vehicleId) => {
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
        title: "¿Desea borrar el vehiculo?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Borrar Vehículo",
        cancelButtonText: "Cancelar",
      });
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8080/api/vehicles/${vehicleId}`);
        setVehiclesData(vehiclesData.filter((v) => v.id !== vehicleId));

        await confirmDelete.fire({
          title: "Borrado",
          text: "El vehiculo ha sido borrado",
          icon: "success",
          timer: "1500",
          className: "py-1 px-2 rounded",
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error borrando el vehiculo: ", error);
      confirmDelete.fire({
        title: "Cancelado",
        text: "El borrado ha sido cancelado",
        timer: "1500",
        icon: "warning",
      });
    }
  };

  if (!isDesktop) {
    return <DesktopOnly />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Lista de Vehiculos disponibles
      </h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-2 px-4 border border-gray-300">ID</th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Name
              </th>
              <th className="text-left py-2 px-4 border border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {vehiclesData.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border border-gray-300">
                  {vehicle.id}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  {vehicle.name}
                </td>
                <td className="py-2 px-4 border border-gray-300">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    Eliminar
                  </button>

                  <Link to={`/administracion/actualizar/${vehicle.id}`}>
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
