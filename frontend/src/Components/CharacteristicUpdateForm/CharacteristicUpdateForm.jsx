import React, { useEffect, useState } from "react";
import ImageIcon from "../../assets/images-input.svg?react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.context";
import axios from "axios";

export const CharacteristicUpdateForm = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });

  const [existingImage, setExistingImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const getCharacteristicData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/characteristics/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData({
          name: response.data.name || "",
        });

        if (response.data.characteristicImage) {
          setExistingImage(response.data.characteristicImage);

          // Add timestamp to prevent caching
          setPreview(
            `http://localhost:8080/api/characteristics/image/${
              response.data.characteristicImage.filename
            }?${new Date().getTime()}`
          );
        } else {
          setPreview(null);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCharacteristicData();
  }, [id, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name.trim());

    if (newImage) {
      form.append("characteristicImage", newImage);
    }

    try {
      await axios.put(
        `http://localhost:8080/api/characteristics/update/${id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/administracion/listar-caracteristicas");
    } catch (err) {
      if (err.response && err.response.data) {
        const errMsg = err.response.data;

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

  return (
    <div className="my-8 max-w-2xl mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="text-2xl py-4 px-6 bg-[#060809] text-white text-center font-bold uppercase">
        Actualizar Característica
      </div>
      <form className="py-4 px-6">
        {error.general && <p className="text-red-500 mb-4">{error.general}</p>}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          />
          {error.name && (
            <p className="text-red-500 text-sm font-bold mt-1">{error.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="images"
            className="block text-gray-700 font-bold mb-2"
          >
            Imagen
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="images"
          />
          <label
            htmlFor="images"
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer flex items-center justify-center"
          >
            <ImageIcon width="50" height="50" />
            <span>Agregar Imagen</span>
          </label>

          <div className="flex flex-wrap mt-2">
            {preview && (
              <div className="m-1 relative">
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            )}

            {error.image && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.image}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center m-4">
          <button
            type="submit"
            className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Editar Characteristica
          </button>
        </div>
      </form>
    </div>
  );
};
