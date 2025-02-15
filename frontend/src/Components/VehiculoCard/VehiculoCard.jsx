import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./VehiculoCard.module.css";
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
        <div className={styles.cardContainer}>
          {currentVehicles.map((vehiculo) => (
            <div className={styles.card} key={vehiculo.id}>
              <h2 className={styles.NombreVehiculo}>{vehiculo.name}</h2>
              {vehiculo.images && vehiculo.images.length > 0 && (
                <Link to={`/vehicle/${vehiculo.id}`}>
                  <img
                    src={`http://localhost:8080/api/vehicles/uploads/${vehiculo.images[0].filename}`}
                    alt={vehiculo.brand}
                    className={styles.cardImage}
                  />
                </Link>
              )}
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
