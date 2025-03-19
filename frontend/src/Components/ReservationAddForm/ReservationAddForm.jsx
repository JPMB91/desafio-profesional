import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { getUserName } from "../Header/Header";

export const ReservationAddForm = () => {
  const location = useLocation();

  const { user, endDate, startDate, vehicleId, vehicleName } =
    location.state || {};

  const [formData, setFormData] = useState({
    userEmail: user.sub,
    startDate: new Date(startDate).toLocaleDateString(),
    endDate: new Date(endDate).toLocaleDateString(),
    vehicleId: vehicleId,
    phoneNumber: "",
  });

  const handleInputChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const name = getUserName();
  return (
    <div className="flex justify-center items-center w-full p-6 bg-gray-50">
      <form className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Formulario de Reservación</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Nombre:</label>
          <input 
            readOnly 
            type="text" 
            id="name" 
            value={name} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Correo electrónico:</label>
          <input
            readOnly
            type="text"
            name="email"
            id="email"
            value={formData.userEmail}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-medium mb-2">Fecha de inicio:</label>
            <input
              readOnly
              type="text"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-medium mb-2">Fecha de termino:</label>
            <input
              readOnly
              type="text"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
            />
          </div>
        </div>
        
        
        
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">Número de teléfono (opcional):</label>
          <input 
            type="tel" 
            name="phoneNumber" 
            id="phoneNumber"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700" 
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-2">Mensaje (opcional):</label>
          <textarea
            name="message"
            id="message"
            rows={5}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 resize-none"
          ></textarea>
        </div>
        
        <div className="flex justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Crear Reservación
          </button>
        </div>
      </form>
    </div>
  );
};
