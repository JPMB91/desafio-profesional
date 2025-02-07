import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { data } from "react-router-dom";

export const UploadImage = ({ onCargaExitosa }) => {
  const [imagen, setImagen] = useState(null);

  //! preview
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      setImagen(imageFile);
      setPreview(URL.createObjectURL(imageFile));
    }
  };

  //!
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imagen) {
      alert("Seleccione una imagen");
      return;
    }

    const formData = new FormData();
    formData.append("imagen", imagen);

    try {
      const response = await axios.post("http://localhost:8080/api/vehiculos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("carga exitosa ", response.data);
      console.log("imagen: ",data.imagen);
      console.log("filename: ", response.data.filename);
      //le paso la imagen por prop
      onCargaExitosa(response.data.filename);
    } catch (error) {
      console.log("Error al subir imagen: ", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        name="image"
        accept="image/*"
        id="image"
        onChange={handleImageChange}
      />
      {preview && <img src={preview} alt="imagen para subir" width="100" />}
      <button onClick={handleUpload}>Subir Imagen</button>
    </div>
  );
};

UploadImage.propTypes = {
  onCargaExitosa: PropTypes.func.isRequired,
};
