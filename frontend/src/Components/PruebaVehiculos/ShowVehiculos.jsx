import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../services/api";

export const ShowVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [isLoading, setIsloading]= useState(true);

  useEffect(() => {
    const fetchVehiculos = async() =>{
      try {
        const response = await api.get("/vehiculos");
        setVehiculos(response.data)
      } catch (error) {
        console.log("Error al obtener vehiculos: ", error);
      } finally{
        setIsloading(false)
      }
    }
    fetchVehiculos()
  }, []);


  return (
    <div>
      <h2>Lista</h2>
      {isLoading ? (
        <p>LOADING...</p>
      ) : (
        <ul>
          {vehiculos.map((vehiculo) => (
            <li key={vehiculo.id}>{vehiculo.marca}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
