import axios from "axios";
import { useEffect, useState } from "react";
// import styles from "./VehiculoCard.module.css";
import { Link } from "react-router-dom";
import { Pagination } from "./Pagination";

export const VehiculoCard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // paginacion
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const currentVehicles = vehicles.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      return prevPage < totalPages ? prevPage + 1 : prevPage;
    });
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageReset = () => {
    setCurrentPage(1);
  };

  // vehiculos
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/vehicles/random"
        );
        setVehicles(response.data);
      } catch (error) {
        console.log("Error al obtener vehiculos: ", error);
      } finally {
        setIsloading(false);
      }
    };
    fetchVehiculos();
  }, []);

  return (
    <div>
      {isLoading ? (
        <p>LOADING...</p>
      ) : (
        //
        <div className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {currentVehicles.map((vehiculo) => (
            <div
              className="w-96 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
              key={vehiculo.id}
            >
              {vehiculo.images && vehiculo.images.length > 0 && (
                <Link to={`/vehicle/${vehiculo.id}`}>
                  <img
                    src={`http://localhost:8080/api/vehicles/uploads/${vehiculo.images[0].filename}`}
                    alt={vehiculo.name}
                    className="h-80 w-96 object-cover rounded-t-xl"
                  />
                </Link>
              )}

              <div className="px-4 py-3 w-72">
                <span className="text-gray-400 mr-3 uppercase text-xs">
                  {vehiculo.brand}
                </span>
                <p className="text-lg font-bold text-black truncate block capitalize">
                  {vehiculo.name}
                </p>
                <div className="flex items-center">
                  <p className="text-lg font-semibold text-black cursor-auto my-3">
                    Costo diario: ${vehiculo.dailyCost}
                  </p>
                  {/* <del>
                    <p className="text-sm text-gray-600 cursor-auto ml-2">
                      {vehiculo.dailyCost}
                    </p>
                  </del> */}
                  <div className="ml-auto">
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-bag-plus"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                      />
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                    </svg> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
