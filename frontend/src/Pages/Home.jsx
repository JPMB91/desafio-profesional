import { VehicleRecommendation } from "../Components/Vehicle/VehicleRecommendation/VehicleRecomendation";

import { VehicleSearchBar } from "../Components/Vehicle/VehicleSearchBar/VehicleSearchBar";
import { VehicleFilter } from "../Components/Vehicle/VehicleFilter/VehicleFilter";


export const Home = () => {
  return (
    <>
      <VehicleSearchBar />
      <VehicleFilter />
      <VehicleRecommendation />
    </>
  );
};
