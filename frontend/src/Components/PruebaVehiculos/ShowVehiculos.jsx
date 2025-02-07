import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../services/api";

export const ShowVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await api.get("/vehiculos");
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
      <h2>Lista</h2>
      {isLoading ? (
        <p>LOADING...</p>
      ) : (
        <div>
          {vehiculos.map((vehiculo) => (
            <div key={vehiculo.id}>
              <h2>{vehiculo.marca}</h2>
              {vehiculo.imagen && (
                <img
                  src={`http://localhost:8080/api/vehiculos/uploads/${vehiculo.imagen}`}
                  alt={vehiculo.marca}
                  style={{ width: "100%", height: "auto" }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
