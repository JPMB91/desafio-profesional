import axios from "axios";
import { useEffect, useState } from "react";

export const VehicleList = () => {
  const [vehicleData, setVehicleData] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const getVehicleData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vehicles");
        setVehicleData(response.data);
        setIsloading(false);
        console.log(vehicleData);
      } catch (error) {
        setIsloading(true);
        console.log(error);
      }
    };
    getVehicleData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Lista de Vehiculos disponibles
      </h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            {/* <caption className="text-left font-medium text-gray-700 bg-gray-100 p-2 rounded-t-lg">
            Available Vehicles
          </caption> */}
            <thead className="bg-gray-300">
              <tr>
                <th className="text-left py-2 px-4 border border-gray-300">
                  ID
                </th>
                <th className="text-left py-2 px-4 border border-gray-300">
                  Name
                </th>
                <th className="text-left py-2 px-4 border border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleData.map((vehicle) => (
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
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
