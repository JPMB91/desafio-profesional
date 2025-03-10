import { Link } from "react-router-dom";
import { useFavorites } from "../../context/Favorite.Context";
import { Heart } from "lucide-react"; // Import Heart icon if using lucide-react
import { useEffect, useState } from "react";
import { StarRating } from "../StarRating/StarRating";
import axios from "axios";

export const VehicleCard = ({ vehicle }) => {
  const { isFavorite, toggleFavorite, isFavoritesEnabled } = useFavorites();
  const isInFavorites = isFavorite(vehicle.id);

  const [vehicleRating, setVehicleRating] = useState(0);

  useEffect(() => {
    const getRatingData = async () => {
      const response = await axios.get(
        `http://localhost:8080/reviews/${vehicle.id}`
      );
      setVehicleRating(response.data);
      console.log(response.data);
    };
    getRatingData();
  }, [vehicleRating]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(vehicle);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
      {isFavoritesEnabled && (
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          aria-label={
            isInFavorites ? "Remove from favorites" : "Add to favorites"
          }
          title={isInFavorites ? "Remove from favorites" : "Add to favorites"}
        >
          {isInFavorites ? (
            <Heart className="text-red-500 fill-red-500 " size={20} />
          ) : (
            <Heart className="text-gray-500 " size={20} />
          )}
        </button>
      )}

      {vehicle.images && vehicle.images.length > 0 ? (
        <img
          src={`http://localhost:8080/api/vehicles/uploads/${vehicle.images[0].filename}`}
          alt={vehicle.name}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Sin imagen</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{vehicle.name}</h3>
            <p className="text-sm text-gray-500">
              {vehicle.manufacturingYear} • {vehicle.numberOfDoors} puertas •{" "}
              {vehicle.numberOfSeats} asientos
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {vehicle.category?.name}
          </span>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-bold text-green-700">
            {formatCurrency(vehicle.dailyCost)}/día
          </div>
          <div className="flex items-center align-middle gap-2">
            <StarRating value={vehicleRating} readOnly={true} />
            {/* <span>• </span> */}
            <h5 className="font-semibold text-[13px] text-gray-500 ">{vehicleRating}</h5>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
            {vehicle.fuelType}
          </span>
          <span className="bg-gray-100 text-xs px-2 py-1 rounded">
            {vehicle.gearShift}
          </span>
        </div>

        <div className="mt-4">
          <Link to={`/vehicle/${vehicle.id}`}>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
              Ver detalles
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
