import React, { useState } from "react";
import axios from "axios";

import ImageIcon from "../../assets/images-input.svg?react";
import { useAuth } from "../../context/Auth.Context";
import { useDesktop } from "../../context/Desktop.Context";
import DesktopOnly from "../DesktopOnly";

export const CategoryAddForm = () => {
  const { isDesktop } = useDesktop();
  const [formData, setFormData] = useState({
    name: "",
    categoryDescription: "",
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState({
    name: "",
    categoryDescription: "",
    general: "",
  });

  const [characteristicImage, setCharacteristicImage] = useState(null);
  const { token } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCharacteristicImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("categoryDescription", formData.categoryDescription);
    form.append("categoryImage", characteristicImage);

    try {
      await axios.post("http://localhost:8080/api/categories", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({ name: "", categoryDescription: "" });
      setPreview(null);
      setCharacteristicImage(null);
      setError({ name: "", categoryDescription: "", general: "" });
    } catch (error) {
      if (error.response && error.response.data) {
        const errMsg = error.response.data;

        // errores
        switch (errMsg) {
          case "Error: El nombre de la categoría debe ser único.":
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isDesktop) {
    return <DesktopOnly />;
  }

  return (
    <div className="my-8 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="text-2xl py-4 px-6 bg-[#060809] text-white text-center font-bold uppercase">
        Crear una Categoria
      </div>
      <form onSubmit={handleSubmit} className="py-4 px-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.name && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="categoryDescription"
            className="block text-gray-700 font-bold mb-2"
          >
            Descripción
          </label>
          <textarea
            name="categoryDescription"
            id="categoryDescription"
            value={formData.categoryDescription}
            onChange={handleInputChange}
            required
            rows={3}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.categoryDescription && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.categoryDescription}
            </p>
          )}
        </div>

        <div className="mb-4">
          <p className="block text-gray-700 font-bold mb-2">Imágen</p>

          <input
            type="file"
            id="categoryImage"
            accept="image/*"
            onChange={handleImageChange}
            required
            name="categoryImage"
            className="hidden"
          />

          <label
            htmlFor="categoryImage"
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

        {error.general && (
          <p className="text-red-500 text-sm font-bold mb-4">{error.general}</p>
        )}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
          >
            Añadir Categoría
          </button>
        </div>
      </form>
    </div>
  );
};
