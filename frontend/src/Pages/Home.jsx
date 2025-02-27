import { Buscador } from "../Components/Buscador/Buscador";
import { Categorias } from "../Components/Categorias/Categorias";
import { Recomendaciones } from "../Components/Recomendaciones/Recomendaciones";

export const Home = () => {
  return (
    <>
      <Buscador />
      <Recomendaciones />
      <Categorias />
    </>
  );
};
