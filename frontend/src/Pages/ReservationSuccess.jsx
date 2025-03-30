import { CircleCheckBig } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export const ReservationSuccess = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full lg:max-w-lg mx-auto flex flex-col shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-[#0C1010] p-4 flex flex-col items-center w-full">
          <img src="/logo.png" alt="Aurora Motors Logo" className="w-32" />
        </div>
        <div className="p-8 bg-white">
          <div className="flex justify-center mb-2">
            <CircleCheckBig size={90} color="#24db52" />
          </div>
          <div className="space-y-4 mb-8">
            <h2 className="text-center font-bold text-2xl underline">
              Reserva Éxitosa
            </h2>
            <p className="text-center font-bold text-xl text-gray-600">
              Gracias por confiar en Aurora Motors. Pronto recibirá un correo con la información
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleRedirect}
              className="bg-[#0C1010] text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
