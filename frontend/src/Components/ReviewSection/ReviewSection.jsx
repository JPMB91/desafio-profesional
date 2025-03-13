// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/Auth.Context";
// import { ReviewAddForm } from "../ReviewAddForm/ReviewAddForm";
// import { ReviewCards } from "../ReviewCards/ReviewCards";

// export const ReviewSection = ({ vehicleId, onReviewAdded }) => {
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   const handleLoginRedirect = () => {
//     navigate("/login", { state: { from: `/vehicle/${vehicleId}` } });
//   };

//   if (!isAuthenticated) {
//     return (
//       <div className="w-96 p-4">
//         <h2 className="text-center font-bold">Reseñas</h2>
//         <div className="text-center p-6 border border-gray-200 rounded-lg mt-4">
//           <p className="mb-4">Necesitas iniciar sesión para dejar una reseña</p>
//           <button
//             className="p-2 bg-blue-600 font-bold text-white rounded hover:bg-blue-700"
//             onClick={handleLoginRedirect}
//           >
//             Iniciar Sesión
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <ReviewAddForm
//         user={user}
//         vehicleId={vehicleId}
//         onReviewAdded={onReviewAdded}
//         isAuthenticated={isAuthenticated}
//       />

//       <ReviewCards vehicleId={vehicleId} />
//     </>
//   );
// };
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.Context";
import { ReviewAddForm } from "../ReviewAddForm/ReviewAddForm";
import { ReviewCards } from "../ReviewCards/ReviewCards";
import { useState } from "react";

export const ReviewSection = ({ vehicleId }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [reviewsUpdated, setReviewsUpdated] = useState(false);

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: `/vehicle/${vehicleId}` } });
  };

  const handleReviewAdded = () => {
    setReviewsUpdated(!reviewsUpdated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Opiniones de Clientes</h2>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {!isAuthenticated ? (
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-center">Dejar una Reseña</h3>
              <div className="text-center">
                <p className="mb-4 text-gray-600">Necesitas iniciar sesión para dejar una reseña</p>
                <button
                  className="w-full p-2 bg-blue-600 font-bold text-white rounded hover:bg-blue-700 transition-colors"
                  onClick={handleLoginRedirect}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          ) : (
            <ReviewAddForm
              user={user}
              vehicleId={vehicleId}
              onReviewAdded={handleReviewAdded}
            />
          )}
        </div>
        
        <div className="md:col-span-2">
          <ReviewCards 
            vehicleId={vehicleId} 
            key={reviewsUpdated ? "updated" : "initial"} 
          />
        </div>
      </div>
    </div>
  );
};