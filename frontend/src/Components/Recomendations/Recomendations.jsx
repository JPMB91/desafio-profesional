import { useEffect, useRef, useState } from "react";
import { VehicleCard } from "../VehicleCard/VehicleCard";
import axios from "axios";
import { LoadingSpinner } from "../LoadingSpinner";
import { Pagination } from "../Pagination/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { CircleAlert } from "lucide-react";

export const Recomendations = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState("");

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
    itemsPerPage: 6,
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
      } catch (error) {
        setError("Error al obtener vehiculos");
        console.error("Error al obtener vehiculos: ", error);
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
      <h2 className="lg:text-2xl font-bold mb-6 md:text-xl">
        Recomendaciones
      </h2>

      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      )}

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
