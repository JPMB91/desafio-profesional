import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VehicleImageGallery } from "../VehicleImageGallery/VehicleImageGallery.jsx";
import { CharacteristicsDisplay } from "../../Characteristic/CharacteristicsDisplay/CharacteristicsDisplay.jsx";


import { ShareBar } from "../../UI/ShareBar/ShareBar.jsx";

import { LoadingSpinner } from "../../UI/LoadingSpinner.jsx";
import { useVehicleRating } from "../../../hooks/useVehicleRating.js";
import { ReviewSection } from "../../Review/ReviewSection/ReviewSection.jsx";

import { es } from "date-fns/locale/es";
import { registerLocale } from "react-datepicker";
import VehicleReservationPolicy from "../VehicleReservationPolicy/VehicleReservationPolicy.jsx";
import { StarRating } from "../../UI/StarRating/StarRating.jsx";
import { ReservationCalendar } from "../../Reservation/ReservationCalendar/ReservationCalendar.jsx";
registerLocale("es", es);

export const VehicleDetail = () => {
  const [vehicleData, setVehicleData] = useState({});
  const [characteristic, setCharacteristics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { vehicleRating, refreshRating } = useVehicleRating(id);

  const url = window.location.href;

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${id}`
        );
        setVehicleData(response.data);
        setCharacteristics(response.data.characteristics);
        setTitle(
          `Encontré este increible ${response.data.name} en Aurora Motors`
        );
        setImage(
          `http://localhost:8080/api/vehicles/uploads/${response.data.images[0]}.filename`
        );
      } catch (error) {
        console.log("Error obteniendo detalle del vehiculo: ", error);
        setError("No se pudo cargar la información del vehículo.");
      }
    };
    getDetail();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (error)
    return (
      <p className="text-red-500 text-3xl font-bold text-center p-8">{error}</p>
    );

  if (!vehicleData) return <LoadingSpinner />;

  return (
    <div className="max-w-full mx-auto p-5">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-left text-3xl font-bold text-gray-800">
            {vehicleData.brand} {vehicleData.model}
          </h2>
          <div className="flex items-center mt-2">
            <StarRating value={vehicleRating} readOnly={true} />
            <span className="ml-2 text-gray-600 font-medium">
              {vehicleRating}
            </span>
          </div>
        </div>
        <div>
          <button
            className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer text-gray-800 py-2 px-6 rounded-lg flex items-center font-bold"
            onClick={() => navigate("/")}
          >
            <span className="mr-1 ">←</span> Volver
          </button>
        </div>
      </div>

      <p className="my-5 text-lg leading-relaxed text-gray-700">
        {vehicleData.description}
      </p>

      {vehicleData.images && vehicleData.images.length > 0 && (
        <div className="flex flex-col md:flex-row w-full gap-4 mb-8">
          <div className="flex-1 rounded-lg overflow-hidden shadow-md">
            <img
              className="w-full h-auto object-cover"
              src={`http://localhost:8080/api/vehicles/uploads/${vehicleData.images[0].filename}`}
              alt="Vehiculo"
            />
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1 relative w-full items-center">
            {vehicleData.images.slice(1, 5).map((img, index) => (
              <img
                key={index}
                className="w-full md:h-48 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                src={`http://localhost:8080/api/vehicles/uploads/${img.filename}`}
                alt={`Vehiculo ${index + 1}`}
              />
            ))}

            <button
              className="text-white font-bold py-2 px-4 rounded-lg cursor-pointer absolute bottom-2.5 right-2.5 hover:bg-black transition-colors duration-200"
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
            >
              Ver más
            </button>
          </div>

          {showModal && (
            <VehicleImageGallery
              images={vehicleData.images}
              close={() => setShowModal(false)}
              showModal={showModal}
            />
          )}
        </div>
      )}
      <CharacteristicsDisplay characteristics={characteristic} />

      <ShareBar
        image={
          vehicleData.images?.[0]?.filename
            ? `http://localhost:8080/api/vehicles/uploads/${vehicleData.images[0].filename}`
            : ""
        }
        title={title}
        url={url}
        description={title}
      />

      {vehicleData ? (
        <ReservationCalendar
          id={id}
          vehicleData={vehicleData}
        />
      ) : (
        <LoadingSpinner />
      )}
      <ReviewSection vehicleId={id} /> 
      <VehicleReservationPolicy />
    </div>
  );
};
