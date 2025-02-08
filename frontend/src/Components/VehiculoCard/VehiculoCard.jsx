import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./VehiculoCard.module.css";

export const VehiculoCard = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vehiculos");
        setVehiculos(response.data);
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
          {vehiculos.map((vehiculo) => (
            <div key={vehiculo.id} className={styles.card}>
              <h2 className={styles.NombreVehiculo}>{vehiculo.marca + " " + vehiculo.modelo}</h2>
              {vehiculo.imagen && (
                <img
                  src={`http://localhost:8080/api/vehiculos/uploads/${vehiculo.imagen}`}
                  alt={vehiculo.marca}
                  style={{ width: "100%", height: "auto" }}
                  className={styles.cardImage}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
