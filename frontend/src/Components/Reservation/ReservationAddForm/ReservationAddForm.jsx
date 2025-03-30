import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { differenceInDays } from "date-fns";
import { CircleAlert } from "lucide-react";
import { useAuth } from "../../../context/Auth.Context";
import { Unauthorized } from "../../Admin/AdminFilter/Unauthorized";
import { LoadingSpinner } from "../../UI/LoadingSpinner";
import { getUserName } from "../../../utils/getUsername";

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

  // Redirección a la página de éxito
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/reserva-exitosa", { replace: true });
      }, 300);
    }
  }, [success, navigate]);

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
    <section className="bg-gradient-to-br from-white to-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="bg-[var(--header-dark)] p-2 flex flex-col items-center">
          <img className="w-32" src="/logo.png" alt="Logo" />
        </div>
        <div>
          <h2 className="text-black text-2xl font-bold p-2 flex flex-col items-center">
            Resumen de la Reserva
          </h2>
        </div>

        <div className="p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="shadow-md rounded-lg mb58 overflow-hidden">
              {vehicleImage && (
                <img
                  src={`http://localhost:8080/api/vehicles/uploads/${vehicleImage}`}
                  alt={vehicleBrand}
                  className="h-64 w-full object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
                Información de la reserva:
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
                <div>
                  <dt className="text-gray-700 text-sm font-medium mb-2">
                    Ubicación:
                  </dt>
                  <dd className="w-full px-3 py-2 rounded-md border-b border-gray-200 text-gray-700">
                    Aeropuerto Internacional Arturo Merino Benítez. Armando Cortinez Ote. 1704, Pudahuel, Región Metropolitana, Chile
                  </dd>
                </div>
              </dl>
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
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
                  Fecha de término:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                  {formData.endDate}
                </dd>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
                Información de costo:
              </h3>
              <dl>
                <dt className="text-gray-700 text-sm font-medium mb-2">
                  Costo total en dólares:
                </dt>
                <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700 font-bold">
                  $ {totalCost}
                </dd>
              </dl>
            </div>
            <div>
              <h3 className="font-bold text-lg border-b border-gray-200 pb-2 mb-4">
                Datos de quien reserva:
              </h3>
              <dl className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
                <div>
                  <dt className="text-gray-700 text-sm font-medium mb-2">
                    Nombre Completo:
                  </dt>
                  <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                    {userFullName}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-700 text-sm font-medium mb-2">
                    Correo electrónico:
                  </dt>
                  <dd className="w-full px-3 py-2 border-b border-gray-200 rounded-md text-gray-700">
                    {formData.email}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
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
              <button className="px-6 py-3 bg-[var(--color-accent-primary)] rounded-xl hover:cursor-pointer hover:bg-[var(--color-accent-primary-hover)] text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md font-bold">
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
