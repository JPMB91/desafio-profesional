import axios from "axios";
import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../../UI/LoadingSpinner";
import { useAuth } from "../../../context/Auth.Context";

import { CircleAlert, Info } from "lucide-react";
import { Unauthorized } from "../../Admin/AdminFilter/Unauthorized";

export const UserReservationHistory = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [reservationData, setReservationData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
 
  const userEmail = user?.sub; 

  useEffect(() => {
    const getReservationData = async () => {
      try {

        if (!userEmail) {
          return;
        }
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/reservations/${userEmail}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservationData(response.data);
      } catch (error) {
        setError("No es posible recuperar la información en estos momentos");
      } finally {
        setIsLoading(false);
      }
    };

    getReservationData();
  }, [userEmail, token]);

  const formatDateTime = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy, HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  if (error) {
    return (
      <div className="mt-4 flex bg-red-100 border-t border-red-500 justify-center text-red-700 p-6 rounded-lg shadow-md lg:w-xl mx-auto items-center">
        <div className="flex items-center">
          <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (reservationData.length === 0) {
    return (
      <div className=" mt-4 flex bg-blue-100 border-t border-blue-500 justify-center text-blue-700 p-6 rounded-lg shadow-md lg:w-xl mx-auto items-center">
        <div className="flex items-center">
          <Info className="h-6 w-6 mr-3 text-blue-500" />
          <p className="text-lg font-medium">No hay reservas para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Reservas</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-300">
            <tr>
              <th className="text-left py-2 px-2 border border-gray-300">
                Vehículo
              </th>
              <th className="text-left py-2 px-2 border border-gray-300">
                Fecha Reservacíon
              </th>
              <th className="text-left py-2 px-2 border border-gray-300">
                Fecha Inicio
              </th>
              <th className="text-left py-2 px-2 border border-gray-300">
                Fecha Termino
              </th>
            </tr>
          </thead>
          <tbody>
            {reservationData.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="py-2 px-2 border border-gray-300">
                  {reservation.vehicleName}
                </td>
                <td className="py-2 px-2 border border-gray-300">
                  {formatDateTime(reservation.createdAt)}
                </td>
                <td className="py-2 px-2 border border-gray-300">
                  {`${reservation.startDate}`}
                </td>
                <td className="py-2 px-2 border border-gray-300">
                  {`${reservation.endDate}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
