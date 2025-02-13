import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AdminPanel = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    const mobileCheck = () => {
      if (width <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    mobileCheck();
  }, [width]);

  return isMobile ? (
    <p>Contenido no está disponible para mobile</p>
  ) : (
    <>
      <Link to="/administracion/add-vehiculo">
        <button>Add Vehiculo</button>
      </Link>

      <Link to="/administracion/lista-vehiculos">
      <button>Lista de Vehiculos</button>
      </Link>
    </>
  );
};
