// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import styles from "./Detail.module.css";
// import { ImageGallery } from "../ImageGallery/ImageGallery";
// import { CharacteristicsDisplay } from "../CharacteristicsDisplay/CharacteristicsDisplay.jsx";
// import { ReservationCalendar } from "../ReservationCalendar/ReservationCalendar.jsx";


// export const VehicleDetail = () => {
//   const [vehicleData, setVehicleData] = useState({});
//   const [characteristic, setCharacteristics] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const getDetail = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8080/api/vehicles/${id}`
//         );
//         setVehicleData(response.data);
//         const { characteristics } = response.data;
//         setCharacteristics(characteristics);
//         console.log(characteristics);
//       } catch (error) {
//         console.log("Error obteniendo detalle del vehiculo: ", error);
//         setError("No se pudo cargar la información del vehículo.");
//       }
//     };
//     getDetail();
//   }, [id]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   if (error) return <p style={{ color: "red" }}>{error}</p>;
//   if (!vehicleData) return <p>Cargando detalles del vehículo...</p>;

//   return (
//     <div className={styles.detailContainer}>
//       <div className={styles.detailHeader}>
//         <h2 className={styles.title}>
//           {vehicleData.brand} {vehicleData.model}
//         </h2>
//         <div>
//           <button className={styles.backButton} onClick={() => navigate(-1)}>
//             ← Volver
//           </button>
//         </div>
//       </div>

//       <p className={styles.description}>{vehicleData.description}</p>

//       {vehicleData.images && vehicleData.images.length > 0 && (
//         <div className={styles.gallery}>
//           <div className={styles.mainImage}>
//             <img
//               src={`http://localhost:8080/api/vehicles/uploads/${vehicleData.images[0].filename}`}
//               alt="Vehiculo"
//             />
//           </div>

//           <div className={styles.imageGrid}>
//             {vehicleData.images.slice(1, 5).map((img, index) => (
//               <img
//                 key={index}
//                 src={`http://localhost:8080/api/vehicles/uploads/${img.filename}`}
//                 alt={`Vehiculo ${index + 1}`}
//               />
//             ))}

//             <button
//               className={styles.viewMore}
//               onClick={() => setShowModal(true)}
//             >
//               Ver más
//             </button>
//           </div>

//           {showModal && (
//             <ImageGallery
//               images={vehicleData.images}
//               close={() => setShowModal(false)}
//               showModal={showModal}
//             />
//           )}
//         </div>
//       )}
//       <CharacteristicsDisplay characteristics={characteristic} />

//       <ReservationCalendar id={id}/>
//     </div>
//   );
// };
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageGallery } from "../ImageGallery/ImageGallery";
import { CharacteristicsDisplay } from "../CharacteristicsDisplay/CharacteristicsDisplay.jsx";
import { ReservationCalendar } from "../ReservationCalendar/ReservationCalendar.jsx";
import Politicas from "../Politicas/Politicas.jsx";

export const VehicleDetail = () => {
  const [vehicleData, setVehicleData] = useState({});
  const [characteristic, setCharacteristics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${id}`
        );
        setVehicleData(response.data);
        const { characteristics } = response.data;
        setCharacteristics(characteristics);

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

  if (error) return <p className="text-red-500 text-3xl font-bold text-center p-8">{error}</p>;
  if (!vehicleData) return <p>Cargando detalles del vehículo...</p>;

  return (
    <div className="max-w-full mx-auto p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-left text-2xl font-bold">
          {vehicleData.brand} {vehicleData.model}
        </h2>
        <div>
          <button className="bg-none border-none text-lg cursor-pointer font-bold" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
      </div>

      <p className="my-5 text-base">{vehicleData.description}</p>

      {vehicleData.images && vehicleData.images.length > 0 && (
        <div className="flex flex-col md:flex-row w-full gap-2.5">
          <div className="flex-1">
            <img
              className="w-full h-auto object-cover"
              src={`http://localhost:8080/api/vehicles/uploads/${vehicleData.images[0].filename}`}
              alt="Vehiculo"
            />
          </div>

          <div className="grid grid-cols-2 grid-rows-2 gap-1.25 flex-1 relative w-full items-center">
            {vehicleData.images.slice(1, 5).map((img, index) => (
              <img
                key={index}
                className="w-full  md:h-48 object-fit"
                src={`http://localhost:8080/api/vehicles/uploads/${img.filename}`}
                alt={`Vehiculo ${index + 1}`}
              />
            ))}

            <button
              className="text-white font-bold py-2 px-4 border-none cursor-pointer absolute bottom-2.5 right-2.5"
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              Ver más
            </button>
          </div>

          {showModal && (
            <ImageGallery
              images={vehicleData.images}
              close={() => setShowModal(false)}
              showModal={showModal}
            />
          )}
        </div>
      )}
      <CharacteristicsDisplay characteristics={characteristic} />

      <ReservationCalendar id={id}/>

      <Politicas />
    </div>
  );
};