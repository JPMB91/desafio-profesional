
import { Categorias } from "../Components/Categorias/Categorias";

import { Recomendaciones } from "../Components/Recomendaciones/Recomendaciones";
import { VehicleFilter } from "../Components/VehicleFilter/VehicleFilter";

export const Home = () => {

  return (
    <>
      <VehicleFilter />

      <Recomendaciones />
      <Categorias />   
    </>
  );
};
