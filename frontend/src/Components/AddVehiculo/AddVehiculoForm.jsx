import { useState } from "react";
import { UploadImage } from "./UploadImage";
// import axios from "axios";
import { api } from "../../services/api";

export const AddVehiculoForm = () => {
  const [data, setData] = useState({
    matricula: "",
    anio: "",
    marca: "",
    modelo: "",
    numeroAsientos: "",
    descripcion: "",
    categoriaVehiculo: "",
    imagen: "",
  });

  // const [error, setError] = useState({
  //   marca: "",
  //   matricula: "",
  //   anio: "",
  //   descripcion: "",
  //   asientos: "",
  //   categoria: "",
  // });

  // const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    console.log(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //! realizo la request de post a la API
    const vehiculoData = { ...data };

    try {
      await api.post("/vehiculos", vehiculoData);
      console.log("Vehiculo guardado exitosamente");
    } catch (error) {
      console.log("error guardando vehiculo: ", error);
    }
    console.log(data);
  };

  return (
    <div>
      <form action="">
        <label htmlFor="marca">Marca</label>
        <input
          type="text"
          name="marca"
          value={data.marca}
          onChange={handleChange}
        />

        <label htmlFor="matricula">Matricula</label>
        <input
          type="text"
          name="matricula"
          value={data.matricula}
          onChange={handleChange}
        />

        <label htmlFor="anio">Año de fabricación</label>
        <input
          type="text"
          name="anio"
          onChange={handleChange}
          value={data.anio}
        />
        <label htmlFor="modelo">Modelo</label>
        <input
          type="text"
          name="modelo"
          value={data.modelo}
          onChange={handleChange}
        />

        <label htmlFor="descripcion">Descripcion</label>
        <input
          type="text"
          name="descripcion"
          value={data.descripcion}
          onChange={handleChange}
        />

        <label htmlFor="numeroAsientos">Numero de asientos</label>
        <input
          type="number"
          name="numeroAsientos"
          id=""
          value={data.numeroAsientos}
          onChange={handleChange}
        />

        <label htmlFor="categoriaVehiculo">Categoria del vehiculo</label>
        <select
          name="categoriaVehiculo"
          id=""
          value={data.categoriaVehiculo}
          onChange={handleChange}
        >
          <option value="">Seleccione una categoria</option>
          <option value="SUV">SUV</option>
          <option value="VEHICULO_CAMIONETA_PICKUP">CAMIONETA PICK-UP</option>
          <option value="VEHICULO_SEDAN">SEDAN</option>
          <option value="VEHICULO_FURGON">Furgon</option>
        </select>

        <UploadImage onCargaExitosa={(filename) => setData((prevData) => ({ ...prevData, imagen: filename }))} />

      </form>

      <button type="submit" onClick={handleSubmit}>
        Añadir Vehiculo
      </button>
    </div>
  );
};
