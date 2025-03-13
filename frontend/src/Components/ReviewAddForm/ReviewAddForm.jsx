// import { useState } from "react";
// import { StarRating } from "../StarRating/StarRating";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export const ReviewAddForm = ({ user, vehicleId, onReviewAdded }) => {
//   const [userRating, setUserRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const [error, setError] = useState({ emptyRating: "", general: "" });

//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:8080/api/reviews", {
//         score: userRating,
//         comment: comment,
//         email: user.sub,
//         vehicleId: vehicleId,
//       });
//       setComment("");
//       setUserRating(0);
//       setError({ emptyRating: "", general: "" });
//       if (onReviewAdded) {
//         onReviewAdded();
//       }
//     } catch (error) {
//       if (error.response) {
//         if (error.response.status === 400) {
//           setError({
//             ...error,
//             emptyRating: "La puntuacíon no puede quedar vacia",
//           });
//         } else {
//           setError({
//             ...error,
//             general: "Ha ocurrido un error al dejar la reseña",
//           });
//         }
//       }
//     }
//   };
//   const handleInputChange = (e) => {
//     setComment(e.target.value);
//   };

//   return (
//     <div className="w-96   p-4">
//       <h2 className="text-center font-bold">Deja una reseña</h2>

//       {error.emptyRating && (
//         <p className="text-red-600 font-bold">{error.emptyRating}</p>
//       )}
//       {error.general && (
//         <p className="text-red-600 font-bold">{error.general}</p>
//       )}
//       <form>
//         <div className="flex justify-between">
//           <StarRating
//             value={userRating}
//             onChange={(newValue) => setUserRating(newValue)}
//             readOnly={false}
//           />
//         </div>

//         <div className="flex-col">
//           <label htmlFor="comment" className="block text-gray-700 mb-2">
//             Dejar un comentario (opcional):
//           </label>
//           <textarea
//             value={comment}
//             name="comment"
//             id="comment"
//             rows={5}
//             onChange={handleInputChange}
//             className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
//           ></textarea>
//         </div>

//         <button
//           className="p-2 bg-amber-400 font-bold m-auto hover:cursor-pointer"
//           type="submit"
//           onClick={handleSubmit}
//         >
//           Enviar reseña
//         </button>
//       </form>
//     </div>
//   );
// };
import { useState } from "react";
import { StarRating } from "../StarRating/StarRating";
import axios from "axios";

export const ReviewAddForm = ({ user, vehicleId, onReviewAdded }) => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState({ emptyRating: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userRating === 0) {
      setError({
        ...error,
        emptyRating: "La puntuación no puede quedar vacía"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await axios.post("http://localhost:8080/api/reviews", {
        score: userRating,
        comment: comment,
        email: user.sub,
        vehicleId: vehicleId,
      });
      
      setComment("");
      setUserRating(0);
      setError({ emptyRating: "", general: "" });
      
      if (onReviewAdded) {
        onReviewAdded();
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError({
            ...error,
            emptyRating: "La puntuación no puede quedar vacía",
          });
        } else {
          setError({
            ...error,
            general: "Ha ocurrido un error al dejar la reseña",
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-center">Dejar una Reseña</h3>
      
      {(error.emptyRating || error.general) && (
        <div className="bg-red-50 p-3 rounded-md mb-4">
          {error.emptyRating && (
            <p className="text-red-600 text-sm">{error.emptyRating}</p>
          )}
          {error.general && (
            <p className="text-red-600 text-sm">{error.general}</p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-medium">
            Puntuación:
          </label>
          <div className="flex justify-center mb-2">
            <StarRating
              value={userRating}
              onChange={(newValue) => {
                setUserRating(newValue);
                if (newValue > 0) {
                  setError({...error, emptyRating: ""});
                }
              }}
              readOnly={false}
            />
          </div>
          <div className="text-center text-sm text-gray-500">
            {userRating > 0 ? `${userRating}/5` : "Selecciona una puntuación"}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 mb-2 font-medium">
            Comentario (opcional):
          </label>
          <textarea
            value={comment}
            name="comment"
            id="comment"
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Comparte tu experiencia..."
          ></textarea>
        </div>
        
        <button
          className="w-full p-3 bg-amber-400 hover:bg-amber-500 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
        </button>
      </form>
    </div>
  );
};