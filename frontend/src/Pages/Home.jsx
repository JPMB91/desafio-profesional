import { Recomendations } from "../Components/Recomendations/Recomendations";
import { SearchBar } from "../Components/SearchBar/SearchBar";
import { VehicleFilter } from "../Components/VehicleFilter/VehicleFilter";

export const Home = () => {
  return (
    <>
    <SearchBar />
      <VehicleFilter />

      <Recomendations />

    
    </>
  );
};
