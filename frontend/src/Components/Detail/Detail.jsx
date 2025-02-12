import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Detail = () => {
  const [vehiculoData, setVehiculoData] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getDetail = async () => {
      try {
        await axios
          .get(`http://localhost:8080/api/vehicles/${id}`)
          .then((response) => {
            setVehiculoData(response.data);
          });
      } catch (error) {
        console.log("Error obteniendo detalle del vehiculo: ", error);
      }
    };
    getDetail();
  }, [id]);

  return (
    <div>
      <h2>{vehiculoData.nombre}</h2>
      <p>{vehiculoData.descripcion}</p>
    </div>
  );
};
