import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./VehiculoCard.module.css";
import { Link } from "react-router-dom";

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

             <div className={styles.card} key={vehiculo.id}>
              <h2 className={styles.NombreVehiculo}>{vehiculo.nombre}</h2>
              {vehiculo.imagenes &&
                vehiculo.imagenes.length > 0 && (
                  <Link to={`/vehiculo/${vehiculo.id}`}>
                    <img
                      src={`http://localhost:8080/api/vehiculos/uploads/${vehiculo.imagenes[0].filename}`}
                      alt={vehiculo.marca}
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
