import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./VehiculoCard.module.css";
import { Link } from "react-router-dom";

export const VehiculoCard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsloading] = useState(true);

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
    console.log(vehicles);
  }, []);
  return (
    <div>
      {isLoading ? (
        <p>LOADING...</p>
      ) : (
        <div className={styles.cardContainer}>
          {vehicles.map((vehiculo) => (
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
    </div>
  );
};
