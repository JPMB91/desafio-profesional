import axios from "axios";
import { useEffect, useState } from "react";

export const VehicleList = () => {
  const [vehicleData, setVehicleData] = useState({});
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const getVehicleData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/vehicles");
        setVehicleData(response.data);
        setIsloading(false);
        console.log(vehicleData);
      } catch (error) {
        setIsloading(true);
        console.log(error);
      }
    };
    getVehicleData();
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
           {vehicleData.map((vehiculo) => (
           
           <h2 key={vehiculo.id}>{vehiculo.id}</h2>
       ))}
        </div>
         
      )}
    </>
  );
};
