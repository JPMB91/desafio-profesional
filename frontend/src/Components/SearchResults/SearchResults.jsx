import React from "react";
import { VehicleCard } from "../VehicleCard/VehicleCard";

const SearchResults = ({ results, searchTerm }) => {
  return (
    <div className="flex-1 mt-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center sm:justify-evenly">
        <h2 className="font-bold lg:text-2xl p-2 md:text-xl ">Resultados</h2>
      </div>
      <div className="bg-white rounded-lg p-4">
        <div
          role="grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {results.length > 0 ? (
            results.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          ) : results.length === 0 && searchTerm ? (
            <div className="col-span-full p-8 text-center text-gray-500">
              No hay vehículos que coincidan con los términos de busqueda.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;