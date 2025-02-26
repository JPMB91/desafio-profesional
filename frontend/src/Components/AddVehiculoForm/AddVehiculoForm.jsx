import { useEffect, useState } from "react";
import axios from "axios";
import { validateForm } from "../../utils/validateForm";
import { useDesktop } from "../../context/Desktop.context";
import DesktopOnly from "../DesktopOnly";
import { useAuth } from "../../context/Auth.Context";

export const AddVehiculoForm = () => {
  const { isDesktop } = useDesktop();
  const { token } = useAuth();

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
    images: "",
  });

  // categorias desde la BBDD
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data);

        console.log("categories, response: ", response.data);
      } catch (error) {
        console.error("Error fetching categories", err);
      }
    };

    getCategories()
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
    console.log("estos files del form crear: ", files);
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

      setFormData({
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
      setError({
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
        images: "",
      });
      setPreviews([]);
    } catch (err) {
      if (err.response && err.response.data) {
        const errMsg = err.response.data;

        // errores
        switch (errMsg) {
          case "Error: Violación de integridad de datos.":
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
      <form onSubmit={handleSubmit} className="py-4 px-6">
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
          {error.name && <p>{error.name}</p>}
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
            rows={5}
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
            <option value="AUTOMATIC">Automatic</option>
            <option value="MANUAL">Manual</option>
            <option value="SEMIAUTOMATIC">Semi Automatic</option>
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
            <option value="">
              Seleccione tipo de combustible del vehiculo
            </option>
            <option value="GASOLINE">GASOLINA</option>
            <option value="ELECTRIC">ELECTRICO</option>
            <option value="DIESEL">DIESEL</option>
            <option value="HYBRID">HIBRIDO</option>
            <option value="BIODIESEL">BIODIESEL</option>
          </select>
          {error.fuelType && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.fuelType}
            </p>
          )}
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

        <div className="mb-4">
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v4a2 2 0 012 2h12a2 2 0 012-2v-4l-7-5 7-5V5a2 2 0 01-2-2H6a2 2 0 01-2 2v6l7 5-7 5z"
              />
            </svg>
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
        <div className="flex items-center justify-center m-4">
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
