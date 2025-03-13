useEffect(() => {
  const getRatingData = async (vehicleId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/reviews/${vehicleId}`
      );

      setVehicleRating(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  getRatingData();
}, [vehicleId]);
