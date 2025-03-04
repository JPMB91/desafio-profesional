import { Recomendations } from "../Components/Recomendations/Recomendaciones";
import { VehicleFilter } from "../Components/VehicleFilter/VehicleFilter";

export const Home = () => {
  return (
    <>
      <VehicleFilter />

      <Recomendations />
    </>
  );
};
