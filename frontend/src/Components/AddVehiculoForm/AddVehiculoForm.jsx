import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AddVehiculoForm.module.css";

export const AddVehiculoForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    registrationPlate: "",
    manufacturingYear: "",
    brand: "",
    model: "",
    numberOfSeats: "",
    description: "",
    categoryId: "",
    gearShift: "",
    numberOfDoors: "",
    dailyCost: "",
    fuelType: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState({
    brand: "",
    registrationPlate: "",
    manufacturingYear: "",
    description: "",
    numberOfSeats: "",
    categoryId: "",
    name: "",
    gearShift: "",
    numberOfDoors: "",
    dailyCost: "",
    fuelType: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((response) => setCategories(response.data))
      .catch((err) => console.error("Error fetching categories", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: parseInt(value, 10) || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("registrationPlate", formData.registrationPlate);
    form.append("manufacturingYear", formData.manufacturingYear);
    form.append("brand", formData.brand);
    form.append("model", formData.model);
    form.append("numberOfSeats", formData.numberOfSeats);
    form.append("description", formData.description);
    form.append("gearShift", formData.gearShift);
    form.append("numberOfDoors", formData.numberOfDoors);
    form.append("dailyCost", formData.dailyCost);
    form.append("fuelType", formData.fuelType);

    form.append("categoryId", formData.categoryId);

    images.forEach((image) => {
      form.append("images", image);
    });

    try {
      await axios.post("http://localhost:8080/api/vehicles", form);
      console.log("Vehiculo guardado exitosamente");
    } catch (err) {
      console.log("formData: ", formData);
      if (err.response && err.response.data) {
        const errMsg = err.response.data;

        // errores
        switch (errMsg) {
          case "Error: El nombre del vehiculo debe ser único.":
            setError((prev) => ({ ...prev, name: errMsg }));
            break;

          case "Error: La matrícula ya está registrada.":
            setError((prev) => ({ ...prev, registrationPlate: errMsg }));
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
    <div>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div>
          <label htmlFor="brand">Marca</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={styles.inputText}
          />

          <label htmlFor="model">Modelo</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={styles.inputText}
          />
          {error.name && <p>{error.name}</p>}

          <label htmlFor="manufacturingYear">Año de fabricación</label>
          <input
            type="text"
            name="manufacturingYear"
            onChange={handleChange}
            value={formData.manufacturingYear}
            className={styles.inputText}
          />

          <label htmlFor="description">Descripcion</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.inputText}
          ></textarea>

          <label htmlFor="numberOfSeats">Numero de asientos</label>
          <select
            type="number"
            name="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleChange}
            className={styles.inputText}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>

          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione una categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="gearShift">Tipo de transmisión</label>
          <select
            name="gearShift"
            id="gearShift"
            value={formData.gearShift}
            onChange={handleChange}
          >
            <option value="">Seleccione un tipo de transmisión</option>
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
            <option value="SEMIAUTOMATIC">Semi Automatic</option>
            <option value="CVT">CVT</option>
          </select>

          <label htmlFor="numberOfDoors">Número de puertas</label>
          <select
            type="number"
            name="numberOfDoors"
            id="numberOfDoors"
            value={formData.numberOfDoors}
            onChange={handleChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <label htmlFor="fuelType">Tipo de combustible</label>
          <select
            type="text"
            name="fuelType"
            id="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
          >
            <option value="">
              Seleccione tipo de combustible del vehiculo
            </option>
            <option value="GASOLINE">GASOLINA</option>
            <option value="ELECTRIC">ELECTRICO</option>
            <option value="DIESEL">DIESEL</option>
            <option value="HYBRID">HIBRIDO</option>
            <option value="BIODIESEL">BIODIESEL</option>
          </select>
          <label htmlFor="registrationPlate">Matricula</label>
          <input
            type="text"
            name="registrationPlate"
            value={formData.registrationPlate}
            onChange={handleChange}
            className={styles.inputText}
          />

          <label htmlFor="dailyCost">Costo diario</label>
          <input
            type="number"
            name="dailyCost"
            value={formData.dailyCost}
            onChange={handleChange}
          />

          <div>
            <label htmlFor="images">Imagenes</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              id="images"
              onChange={handleImageChange}
              className={styles.inputText}
              multiple
            />
            {previews.length > 0 &&
              previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`formData.name ${index}`}
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
