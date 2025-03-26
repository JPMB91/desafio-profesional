import axios from "axios";
import { CircleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageIcon from "../../../assets/images-input.svg?react";
import { useAuth } from "../../../context/Auth.Context";
import { useDesktop } from "../../../context/Desktop.Context";
import { validateForm } from "../../../utils/validateForm";
import DesktopOnly from "../../UI/DesktopOnly";
import { MultiSelectDropDown } from "../../UI/MultiSelectDropDown/MultiSelectDropDown.jsx";

export const VehicleUpdateForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const { isDesktop } = useDesktop();

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
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);

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

  useEffect(() => {
    const getVehicleData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${id}`
        );

        setFormData({
          registrationPlate: response.data.registrationPlate || "",
          manufacturingYear: response.data.manufacturingYear || "",
          brand: response.data.brand || "",
          model: response.data.model || "",
          numberOfSeats: response.data.numberOfSeats || "",
          description: response.data.description || "",
          categoryId: response.data.category ? response.data.category.id : "",
          gearShift: response.data.gearShift || "",
          numberOfDoors: response.data.numberOfDoors || "",
          dailyCost: response.data.dailyCost || "",
          fuelType: response.data.fuelType || "",
        });

        setSelectedCharacteristics(
          response.data.characteristics.map((c) => c.id)
        );

        if (response.data.images && response.data.images.length > 0) {
          setImages(response.data.images);
          const originalPreviews = await response.data.images.map(
            (img) =>
              `http://localhost:8080/api/vehicles/uploads/${img.filename}`
          );
          setPreviews(originalPreviews);
        }

        console.log("imagenes:", images);
      } catch (error) {
        console.log(error);
      }
    };

    getVehicleData();
  }, []);

  // categorias y characteristicas desde la BBDD
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

  // para campos de texto
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
    setNewImages(files);

    console.log("estos files: ", files);
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    // quito la imagen del preview
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < images.length) {
      // si se trata de imagenes que ya estan persistidad
      // agrega su filename a imagesToDelete para que las reciba el back-end
      setImagesToDelete((prev) => [...prev, images[index].filename]);

      // las quita del estado de images que refleja las ya persistidas
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      // si es nueva imagen las quita del estado de newImages
      const newIndex = index - images.length;
      setNewImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
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
    form.append("numberOfSeats", formData.numberOfSeats);
    form.append("description", formData.description.trim());
    form.append("gearShift", formData.gearShift.trim());
    form.append("numberOfDoors", formData.numberOfDoors);
    form.append("dailyCost", formData.dailyCost);
    form.append("fuelType", formData.fuelType.trim());
    form.append("categoryId", formData.categoryId);

    // agrego las nuevas imagenes al form para enviar a backend
    newImages.forEach((file) => {
      form.append("newImages", file);
    });

    // envio los nombres de las imagenes a borrar
    imagesToDelete.forEach((imgId) => {
      form.append("fileImagesToDelete", imgId);
    });

    selectedCharacteristics.forEach((charId) => {
      form.append("characteristics", charId);
    });

    try {
      await axios.put(`http://localhost:8080/api/vehicles/update/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      setImages([]);
      setNewImages([]);
      navigate("/administracion/lista-vehiculos");
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

  if (!isDesktop) {
    return <DesktopOnly />;
  }

  return (
    <div className="my-8 h-max max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="text-2xl py-4 px-6 bg-[#060809] text-white text-center font-bold uppercase">
        Actualizar Vehiculo
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
            <div className="flex items-center align-middle mt-1">
            <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
            <span className="text-sm text-red-500 te font-bold mt-1">
              {error.brand}
            </span>
          </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.model}
              </span>
            </div>
          )}
          {error.name && (
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.name}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.manufacturingYear}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.description}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.categoryId}
              </span>
            </div>
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
            <option value="SEMIAUTOMATIC">Semi-Automátic</option>
            <option value="CVT">CVT</option>
          </select>
          {error.gearShift && (
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.gearShift}
              </span>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="numberOfSeats"
            className="block text-gray-700 font-bold mb-2"
          >
            Número de asientos
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.numberOfSeats}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.numberOfDoors}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.fuelType}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.registrationPlate}
              </span>
            </div>
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
            <div className="flex items-center align-middle mt-1">
              <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
              <span className="text-sm text-red-500 te font-bold mt-1">
                {error.dailyCost}
              </span>
            </div>
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
                    handleRemoveImage(index);
                  }}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
            {error.images && (
              <div className="flex items-center align-middle mt-1">
                <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                <span className="text-sm text-red-500 te font-bold mt-1">
                  {error.images}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center m-4 col-span-1 md:col-span-2">
          <button
            type="submit"
            className="bg-gray-900 text-white py-3.5 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline font-bold"
          >
            Editar Vehiculo
          </button>
        </div>
      </form>
    </div>
  );
};
