import { useState } from "react";
import axios from "axios";
import styles from "./AddVehiculoForm.module.css";

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

  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState({
    marca: "",
    matricula: "",
    anio: "",
    descripcion: "",
    asientos: "",
    categoria: "",
    nombre: "",
  });

  // const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setImagenes(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

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

    // Append each image using the same key "imagen"
    imagenes.forEach((imagen) => {
      form.append("imagen", imagen);
    });

    try {
      await axios.post("http://localhost:8080/api/vehiculos", form);
      console.log("Vehiculo guardado exitosamente");
    } catch (err) {
      if (err.response && err.response.data) {
        const errMsg = err.response.data;

        // Exact error matching
        switch (errMsg) {
          case "Error: El nombre del vehiculo debe ser único.":
            setError((prev) => ({ ...prev, nombre: errMsg }));
            break;

          case "Error: La matrícula ya está registrada.":
            setError((prev) => ({ ...prev, matricula: errMsg }));
            break;

          default:
            setError((prev) => ({
              ...prev,
              general: "Ocurrió un error desconocido.",
            }));
            break;
        }
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="marca">Marca</label>
          <input
            type="text"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className={styles.inputText}
          />

          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            className={styles.inputText}
          />
          {error.nombre && <p>{error.nombre}</p>}

          <label htmlFor="anio">Año de fabricación</label>
          <input
            type="text"
            name="anio"
            onChange={handleChange}
            value={formData.anio}
            className={styles.inputText}
          />

          <label htmlFor="descripcion">Descripcion</label>
          <textarea
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={styles.inputText}
          ></textarea>

          <label htmlFor="numeroAsientos">Numero de asientos</label>
          <input
            type="number"
            name="numeroAsientos"
            id=""
            value={formData.numeroAsientos}
            onChange={handleChange}
            className={styles.inputText}
          />

          <label htmlFor="categoriaVehiculo">Categoria del vehiculo</label>
          <select
            name="categoriaVehiculo"
            id=""
            value={formData.categoriaVehiculo}
            onChange={handleChange}
          >
            <option value="">Seleccione una categoria</option>
            <option value="VEHICULO_SUV">SUV</option>
            <option value="VEHICULO_CAMIONETA_PICKUP">CAMIONETA PICK-UP</option>
            <option value="VEHICULO_SEDAN">SEDAN</option>
            <option value="VEHICULO_FURGON">Furgon</option>
          </select>

          <label htmlFor="matricula">Matrícula</label>
          <input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleChange}
            className={styles.inputText}
          />
          <div>
            <label htmlFor="imagen">Imagen</label>
            <input
              type="file"
              name="imagen"
              accept="image/*"
              id="imagen"
              onChange={handleImageChange}
              className={styles.inputText}
              multiple
            />
            {previews.length > 0 &&
              previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="imagen para subir"
                  width="100"
                />
              ))}
          </div>
        </div>
        <button type="submit" className={styles.formButton}>
          Añadir Vehiculo
        </button>
      </form>
    </div>
  );
};
