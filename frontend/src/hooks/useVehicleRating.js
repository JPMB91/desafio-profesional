
import { useState, useEffect } from "react";
import axios from "axios";

export const useVehicleRating = (vehicleId) => {
  const [vehicleRating, setVehicleRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRating = async () => {
    if (!vehicleId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/reviews/${vehicleId}`
      );
      setVehicleRating(response.data);
      setError(null);
    } catch (error) {
      console.error("Error obteniendo puntaje del vehiculo:", error);
      setError("Error obteniendo puntaje del vehiculo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRating();
  }, [vehicleId]);

  return { vehicleRating, loading, error, refreshRating: fetchRating };
};