import React, { useEffect, useState } from "react";
import { redirect, replace, useLocation, useNavigate } from "react-router-dom";
import { getUserName } from "../Header/Header";
import { differenceInDays } from "date-fns";
import axios from "axios";
import { useAuth } from "../../context/Auth.Context";
import { Unauthorized } from "../AdminFilter/Unauthorized";
import { LoadingSpinner } from "../LoadingSpinner";
import { CircleAlert } from "lucide-react";

export const ReservationAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userFullName = getUserName();
  const { token, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    user,
    endDate,
    startDate,
    vehicleId,
    vehicleImage,
    vehicleBrand,
    vehicleModel,
    vehicleDailyCost,
  } = location.state || {};

  const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
  const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    email: user?.sub,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    vehicleId: vehicleId,
    message: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotalCost = () => {
    return differenceInDays(endDate, startDate) * vehicleDailyCost;
  };

  const totalCost = calculateTotalCost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post("http://localhost:8080/api/reservations", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
    } catch (error) {
      console.log(error);
      if (error.response?.status === 409) {
        setError(error.response.data);
      } else {
        setError("Error al enviar la reserva.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // redireccion a pagina de éxito
  useEffect(() => {
    const handleSuccessRedirect = () => {
      if (success) {
        setTimeout(() => {
          navigate("/reserva-exitosa", { replace: true });
        }, 300);
      }
    };
    handleSuccessRedirect();
  }, [success]);

  if (!isAuthenticated) {
    return <Unauthorized />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <LoadingSpinner />
          <p className="mt-4 text-center text-gray-700 font-bold">
            Procesando su reserva...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center w-full p-6 bg-gray-50">
      <form
        className="w-full max-w-xl bg-white shadow-md rounded-lg p-6 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Resumen de la Reserva
          </h2>
          {/* <div className="w-full shadow-md rounded-lg mb-8 overflow-hidden">
            {vehicleImage && (
              <img
                src={`http://localhost:8080/api/vehicles/uploads/${vehicleImage}`}
                alt={vehicleBrand}
                className="h-64 w-full object-cover"
              />
            )}
          </div> */}
          <div className="mb-6">
            <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
              Informacion de la reserva:
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Marca:
                </dt>
                <dd className="w-full px-3 py-2 rounded-md border-b border-gray-200 text-gray-700">
                  {vehicleBrand}
                </dd>
              </div>
              <div>
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Modelo:
                </dt>
                <dd className="w-full px-3 py-2 rounded-md border-b border-gray-200 text-gray-700">
                  {vehicleModel}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mb-6">
            <dl className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div>
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Fecha de inicio:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                  {formData.startDate}
                </dd>
              </div>

              <div>
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Fecha de termino:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                  {formData.endDate}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
              Información de costo:
            </h3>
            <dl>
              <dt className="text-gray-700 text-sm font-medium mb-2">
                Costo total en dolares:
              </dt>
              <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700 font-bold">
                $ {totalCost}
              </dd>
            </dl>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
              Datos de quien reserva:
            </h3>
            <dl className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="mb-2">
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Nombre Completo:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                  {userFullName}
                </dd>
              </div>

              <div className="mb-2">
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Correo electrónico:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                  {formData.email}
                </dd>
              </div>
            </dl>
          </div>
          <div className="mb-6">
            <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
              Mensaje:
            </h3>
            <label
              htmlFor="message"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Mensaje (opcional):
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
            ></textarea>
          </div>

          {error && (
             <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
             <div className="flex items-center">
               <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
               <p className="text-lg font-medium">{error}</p>
             </div>
           </div>
          )}
          
          <div className="flex justify-center mt-4">
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Confirmar Reserva
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
