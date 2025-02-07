import { useState } from "react";
import axios from "axios";

export const AddVehiculoForm = () => {
  const [formData, setFormData] = useState({
    matricula: "",
    anio: "",
    marca: "",
    modelo: "",
    numeroAsientos: "",
    descripcion: "",
    categoriaVehiculo: "",
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);

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
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      setImagen(imageFile);
      setPreview(URL.createObjectURL(imageFile));
    }
  };

  // este handler incluye la imagen
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("matricula", formData.matricula);
    form.append("anio", formData.anio);
    form.append("marca", formData.marca);
    form.append("modelo", formData.modelo);
    form.append("numeroAsientos", formData.numeroAsientos);
    form.append("descripcion", formData.descripcion);
    form.append("categoriaVehiculo", formData.categoriaVehiculo);
    if (imagen) form.append("imagen", imagen);

    try {

      await axios.post("http://localhost:8080/api/vehiculos", form);
      console.log("Vehiculo guardado exitosamente");
      console.log(form);
    } catch (error) {
      console.log("error guardando vehiculo: ", error);
    }
    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="marca">Marca</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
          />

          <label htmlFor="matricula">Matricula</label>
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
          />

          <label htmlFor="anio">Año de fabricación</label>
          <input
            type="text"
            name="anio"
            onChange={handleChange}
            value={formData.anio}
          />
          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
          />

          <label htmlFor="descripcion">Descripcion</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />

          <label htmlFor="numeroAsientos">Numero de asientos</label>
          <input
            type="number"
            name="numeroAsientos"
            id=""
            value={formData.numeroAsientos}
            onChange={handleChange}
          />

          <label htmlFor="categoriaVehiculo">Categoria del vehiculo</label>
          <select
            name="categoriaVehiculo"
            id=""
            value={formData.categoriaVehiculo}
            onChange={handleChange}
          >
            <option value="">Seleccione una categoria</option>
            <option value="SUV">SUV</option>
            <option value="VEHICULO_CAMIONETA_PICKUP">CAMIONETA PICK-UP</option>
            <option value="VEHICULO_SEDAN">SEDAN</option>
            <option value="VEHICULO_FURGON">Furgon</option>
          </select>

          <div>
            <label htmlFor="imagen">Imagen</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              id="imagen"
              onChange={handleImageChange}
            />
            {preview && (
              <img src={preview} alt="imagen para subir" width="100" />
            )}
          </div>
        </div>
        <button type="submit">
        Añadir Vehiculo
      </button>
      </form>

      
    </div>
  );
};
