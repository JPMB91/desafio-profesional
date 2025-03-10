import { Recomendations } from "../Components/Recomendations/Recomendations";
import { SearchBar } from "../Components/SearchBar/SearchBar";
import { StarRating } from "../Components/StarRating/StarRating";
import { TestGetRating } from "../Components/TestGetRating";
import { VehicleFilter } from "../Components/VehicleFilter/VehicleFilter";

export const Home = () => {
  return (
    <>
      <SearchBar />
      <VehicleFilter />
      <Recomendations />

      <TestGetRating />
    </>
  );
};
