import React from "react";
import { VehicleCard } from "../VehicleCard/VehicleCard";

const VehicleSearchResults = ({ results, currentVehicles, searchTerm }) => {
  return (
    <div className="flex-1 mt-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="font-bold lg:text-xl md:text-base ml-4">Resultados</h2>
        <div className="text-sm text-gray-600">
          Mostrando{" "}
          <span className="font-medium">{currentVehicles.length}</span> de{" "}
          <span className="font-medium">{results.length}</span> vehículo(s)
          encontrado(s)
        </div>
      </div>

      <div className="bg-white rounded-lg p-4">
        <div
          role="grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {currentVehicles.length > 0 &&
            currentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchResults;
