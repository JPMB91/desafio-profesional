import axios from "axios";
import React, { useState } from "react";

import ImageIcon from "../../../assets/images-input.svg?react";
import { useAuth } from "../../../context/Auth.Context";
import { useDesktop } from "../../../context/Desktop.Context";
import DesktopOnly from "../../UI/DesktopOnly";

export const CharacteristicAddForm = () => {
  const { isDesktop } = useDesktop();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState({
    descriptionName: "",
    general: "",
  });
  const [characteristicImage, setCharacteristicImage] = useState(null);
  const { token } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCharacteristicImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("characteristicImage", characteristicImage);

    try {
      await axios.post("http://localhost:8080/api/characteristics", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setName(""), setPreview(null);
      setCharacteristicImage(null);
      setError({ descriptionName: "", general: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        const errMsg = error.response.data;

        // errores
        switch (errMsg) {
          case "Error: El nombre de la característica debe ser único.":
            setError((prev) => ({ ...prev, name: errMsg }));
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
    <div className="my-8 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="text-2xl py-4 px-6 bg-[#060809] text-white text-center font-bold uppercase">
        Crear una Caracteristica
      </div>
      <form onSubmit={handleSubmit} className="py-4 px-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.name && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.name}</p>
          )}
          {error.general && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.general}
            </p>
          )}
        </div>
        <div className="mb-4">
          <p className="block text-gray-700 font-bold mb-2">Imágen</p>
          <input
            type="file"
            id="characteristicImage"
            accept="image/*"
            onChange={handleImageChange}
            required
            name="characteristicImage"
            className="hidden"
          />

          <label
            htmlFor="characteristicImage"
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer flex items-center justify-center"
          >
            <ImageIcon width="50" height="50" />
            <span className="ml-2">Agregar imágenes</span>
          </label>

           {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Vista previa"
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          )}
        </div>


        <div className="flex items-center justify-center m-4">
          <button
            type="submit"
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            Añadir Característica
          </button>
        </div>
      </form>
    </div>
  );
};
