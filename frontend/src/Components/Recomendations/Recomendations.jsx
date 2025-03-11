import { useEffect, useRef, useState } from "react";
import { VehicleCard } from "../VehicleCard/VehicleCard";
import axios from "axios";
import { LoadingSpinner } from "../LoadingSpinner";
import { Pagination } from "../Pagination/Pagination";
import { usePagination } from "../../hooks/usePagination";

export const Recomendations = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  // hook para paginacion
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePrevPage,
    handleNextPage,
    handlePageClick,
    handlePageReset,
  } = usePagination({
    totalItems: vehicles.length,
    itemsPerPage: 6 
  });

  // referencia del componente en dom
  const vehicleRecomendationRef = useRef(null);

  // los vehiculos en la pagina actual
  const currentVehicles = vehicles.slice(startIndex, endIndex);

  // actualiza la enfoque de la vista a la referencia del componente
  useEffect(() => {
    if (vehicleRecomendationRef.current) {
      vehicleRecomendationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // vehiculos
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/vehicles/random"
        );
        setVehicles(response.data);
        console.log("API response:", response.data);
      } catch (error) {
        console.log("Error al obtener vehiculos: ", error);
      } finally {
        setIsloading(false);
      }
    };
    fetchVehiculos();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="container mx-auto px-4 py-8 w-full max-w-6xl"
      ref={vehicleRecomendationRef}
    >
      <h2 className="lg:text-2xl font-bold mb-6 md:text-base">
        Recomendaciones
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:w-2xl w-auto m-auto">
        {currentVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {vehicles.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageClick}
          onPageReset={handlePageReset}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
    </div>
  );
};
