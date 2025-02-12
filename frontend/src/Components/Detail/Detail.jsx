import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Detail.module.css"
import { ImageGallery } from "../ImageGallery/ImageGallery";

export const Detail = () => {
  const [vehicleData, setVehicleData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/vehicles/${id}`);
        setVehicleData(response.data);
      } catch (error) {
        console.log("Error obteniendo detalle del vehiculo: ", error);
        setError("No se pudo cargar la información del vehículo.");
      }
    };
    getDetail();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!vehicleData) return <p>Cargando detalles del vehículo...</p>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <h2 className={styles.title}>
          {vehicleData.brand} {vehicleData.model}
        </h2>
        <div>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>

      <p className={styles.description}>{vehicleData.description}</p>

      {vehicleData.images && vehicleData.images.length > 0 && (
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={`http://localhost:8080/api/vehicles/uploads/${vehicleData.images[0].filename}`}
              alt="Vehiculo"
            />
          </div>

          <div className={styles.imageGrid}>
            {vehicleData.images.slice(1, 5).map((img, index) => (
              <img
                key={index}
                src={`http://localhost:8080/api/vehicles/uploads/${img.filename}`}
                alt={`Vehiculo ${index + 1}`}
              />
            ))}

          
              <button
                className={styles.viewMore}
                onClick={() => setShowModal(true)}
              >
                Ver más
              </button>

          </div>

          {showModal && (
            <ImageGallery
              images={vehicleData.images}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};