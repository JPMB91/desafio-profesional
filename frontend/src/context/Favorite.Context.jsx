import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth.Context";

function getFavoritesFromStorage() {
  const stored = localStorage.getItem("favoriteVehicles");
  return stored ? JSON.parse(stored) : [];
}

const initialState = {
  favorites: getFavoritesFromStorage(),
};

const FavoriteContext = createContext(initialState);

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(initialState.favorites);
  const { isAuthenticated, hasRole } = useAuth();

  useEffect(() => {
    localStorage.setItem("favoriteVehicles", JSON.stringify(favorites));
  }, [favorites]);


  const addFavorite = (vehicle) => {
    setFavorites((prev) => {
      if (prev.find((fav) => fav.id === vehicle.id)) return prev;

      return [...prev, vehicle];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const toggleFavorite = (vehicle) => {
    if (isFavorite(vehicle.id)) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }
  };

  const isFavorite = (id) => {
    return favorites.some(fav => fav.id === id);
  };

  const isFavoritesEnabled = isAuthenticated && hasRole("ROLE_USER");

  return (
    <FavoriteContext.Provider
      value={{ favorites, removeFavorite, addFavorite, isFavorite, toggleFavorite, isFavoritesEnabled }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);
