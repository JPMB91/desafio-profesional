import { useEffect, useState } from "react";
import axios from "axios";
import { validateForm } from "../../utils/validateForm.js";
import { useDesktop } from "../../context/Desktop.Context.jsx";
import DesktopOnly from "../DesktopOnly.jsx";

import { MultiSelectDropDown } from "../MultiSelectDropDown/MultiSelectDropDown.jsx";
import ImageIcon from "../../assets/images-input.svg?react";
import { useAuth } from "../../context/Auth.Context.jsx";

export const VehicleAddForm = () => {
  const { isDesktop } = useDesktop();
  const { token } = useAuth();
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

  const [categories, setCategories] = useState([]);

  const initialFormState = {
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
  };
  const [formData, setFormData] = useState(initialFormState);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [error, setError] = useState({
    brand: "",
    registrationPlate: "",
    manufacturingYear: "",
    description: "",
    numberOfSeats: "",
    categoryId: "",
    descriptionName: "",
    gearShift: "",
    numberOfDoors: "",
    dailyCost: "",
    fuelType: "",
    images: "",
  });

  // categorias y characteristicas
  useEffect(() => {
    const getData = async () => {
      try {
        const [categoriesResponse, characteristicsResponse] = await Promise.all(
          [
            axios.get("http://localhost:8080/api/categories"),
            axios.get("http://localhost:8080/api/characteristics"),
          ]
        );

        setCategories(categoriesResponse.data);
        setCharacteristics(characteristicsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getData();
  }, []);

  const handleInputChange = (e) => {
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
    console.log("Selected files:", files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValidated = validateForm({ images, ...formData });

    if (!formValidated.isValid) {
      setError(formValidated.newErrors);
      return;
    }

    const form = new FormData();
    form.append("registrationPlate", formData.registrationPlate.trim());
    form.append("manufacturingYear", formData.manufacturingYear.trim());
    form.append("brand", formData.brand.trim());
    form.append("model", formData.model.trim());
    form.append("numberOfSeats", formData.numberOfSeats.trim());
    form.append("description", formData.description.trim());
    form.append("gearShift", formData.gearShift.trim());
    form.append("numberOfDoors", formData.numberOfDoors.trim());
    form.append("dailyCost", formData.dailyCost.trim());
    form.append("fuelType", formData.fuelType.trim());

    form.append("categoryId", formData.categoryId);

    selectedCharacteristics.forEach((c) => {
      form.append("characteristics", c);
    });

    images.forEach((image) => {
      form.append("images", image);
    });

    try {
      await axios.post("http://localhost:8080/api/vehicles", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Vehiculo guardado exitosamente");

      setFormData(initialFormState);
      setError({
        brand: "",
        registrationPlate: "",
        manufacturingYear: "",
        description: "",
        numberOfSeats: "",
        categoryId: "",
        descriptionName: "",
        gearShift: "",
        numberOfDoors: "",
        dailyCost: "",
        fuelType: "",
        images: "",
      });
      setPreviews([]);
    } catch (err) {
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

  return !isDesktop ? (
    <DesktopOnly />
  ) : (
    <div className="my-8 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="text-2xl py-4 px-6 bg-[#060809] text-white text-center font-bold uppercase">
        Ingrese un nuevo Vehiculo
      </div>
      <form
        onSubmit={handleSubmit}
        className="py-4 px-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="mb-4">
          <label htmlFor="brand" className="block text-gray-700 font-bold mb-2">
            Marca
          </label>
          <input
            type="text"
            name="brand"
            id="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.brand && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.brand}</p>
          )}
        </div>
        <div>
          <label htmlFor="model" className="block text-gray-700 font-bold mb-2">
            Modelo
          </label>
          <input
            type="text"
            name="model"
            id="model"
            value={formData.model}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.model && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.model}</p>
          )}
          {error.name && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="manufacturingYear"
            className="block text-gray-700 font-bold mb-2"
          >
            Año de fabricación
          </label>
          <input
            type="number"
            min={1980}
            max={new Date().getFullYear()}
            name="manufacturingYear"
            id="manufacturingYear"
            onChange={handleInputChange}
            value={formData.manufacturingYear}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.manufacturingYear && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.manufacturingYear}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Descripcion
          </label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
            rows={3}
          ></textarea>
          {error.description && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.description}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="block text-gray-700 font-bold mb-2"
          >
            Categoria
          </label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId || ""}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          >
            <option value="">Seleccione una categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {error.categoryId && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.categoryId}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="gearShift"
            className="block text-gray-700 font-bold mb-2"
          >
            Tipo de transmisión
          </label>
          <select
            name="gearShift"
            id="gearShift"
            value={formData.gearShift}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          >
         
            <option value="">Seleccione un tipo de transmisión</option>
            <option value="AUTOMATIC">Automático</option>
            <option value="MANUAL">Manual</option>
            <option value="SEMI_AUTOMATIC">Semi-Automático</option>
            <option value="CVT">CVT</option>
          </select>
          {error.gearShift && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.gearShift}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="numberOfSeats"
            className="block text-gray-700 font-bold mb-2"
          >
            Numero de asientos
          </label>
          <select
            type="number"
            name="numberOfSeats"
            id="numberOfSeats"
            value={formData.numberOfSeats}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          >
            <option value="">Seleccione el numero de asientos</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          {error.numberOfSeats && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.numberOfSeats}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="numberOfDoors"
            className="block text-gray-700 font-bold mb-2"
          >
            Número de puertas
          </label>
          <select
            type="number"
            name="numberOfDoors"
            id="numberOfDoors"
            value={formData.numberOfDoors}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          >
            <option value="">Seleccione el numero de puertas</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          {error.numberOfDoors && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.numberOfDoors}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="fuelType"
            className="block text-gray-700 font-bold mb-2"
          >
            Tipo de combustible
          </label>
          <select
            type="text"
            name="fuelType"
            id="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          >
         
            <option value="">Seleccione tipo de combustible</option>
            <option value="GASOLINE">Gasolina</option>
            <option value="ELECTRIC">Eléctrico</option>
            <option value="DIESEL">Diesel</option>
            <option value="HYBRID">Híbrido</option>
            <option value="BIODIESEL">Biodiesel</option>
          </select>
          {error.fuelType && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.fuelType}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="characteristics"
            className="block text-gray-700 font-bold mb-2"
          >
            Caracteristicas para el vehiculo
          </label>
          <MultiSelectDropDown
            options={characteristics}
            selectedOptions={selectedCharacteristics}
            setSelectedOptions={setSelectedCharacteristics}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label
            htmlFor="registrationPlate"
            className="block text-gray-700 font-bold mb-2"
          >
            Matricula
          </label>
          <input
            type="text"
            name="registrationPlate"
            id="registrationPlate"
            value={formData.registrationPlate}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.registrationPlate && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.registrationPlate}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="dailyCost"
            className="block text-gray-700 font-bold mb-2"
          >
            Costo diario
          </label>
          <input
            type="number"
            name="dailyCost"
            id="dailyCost"
            value={formData.dailyCost}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.dailyCost && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.dailyCost}
            </p>
          )}
        </div>
        <div className="mb-4 col-span-1 md:col-span-2">
          <label
            htmlFor="images"
            className="block text-gray-700 font-bold mb-2"
          >
            Imágenes
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="images"
            multiple
          />
          <label
            htmlFor="images"
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer flex items-center justify-center"
          >
            <ImageIcon width="50" height="50" />

            <span>Agregar imágenes</span>
          </label>
          <div className="flex flex-wrap mt-2">
            {previews.map((preview, index) => (
              <div key={index} className="m-1 relative">
                <img
                  src={preview}
                  alt={`vehicle preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={() => {
                    const newPreviews = [...previews];
                    newPreviews.splice(index, 1);
                    setPreviews(newPreviews);

                    const newImages = [...images];
                    newImages.splice(index, 1);
                    setImages(newImages);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
            {error.images && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.images}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center m-4 col-span-1 md:col-span-2">
          <button
            type="submit"
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            Añadir Vehiculo
          </button>
        </div>
      </form>
    </div>
  );
};
