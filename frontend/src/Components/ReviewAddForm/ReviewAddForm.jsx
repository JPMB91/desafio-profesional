import { useState } from "react";
import { StarRating } from "../StarRating/StarRating";
import axios from "axios";

export const ReviewAddForm = ({ user, vehicleId, onReviewAdded }) => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState({ emptyRating: "", general: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          setError({ ...error, emptyRating: "La puntuacíon no puede quedar vacia" });
        }else{
          setError({...error, general: "Ha ocurrido un error al dejar la reseña"})
        }
      }
    }
  };
  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <div className="w-96   p-4">
      <h2 className="text-center font-bold">Deja una reseña</h2>

      {error.emptyRating && <p className="text-red-600 font-bold">{error.emptyRating}</p>}
      {error.general && <p className="text-red-600 font-bold">{error.general}</p>}
      <form>
        <div className="flex justify-between">
          <h3>Puntua el vehículo</h3>
          <StarRating
            value={userRating}
            onChange={(newValue) => setUserRating(newValue)}
            readOnly={false}
          />
        </div>

        <div className="flex-col">
          <label htmlFor="comment" className="block text-gray-700 mb-2">
            Puedes dejar un comentario:
          </label>
          <textarea
            value={comment}
            name="comment"
            id="comment"
            rows={5}
            onChange={handleInputChange}
            className="border border-gray-400 p-2 w-full rounded-lg focus:outline-none focus:border-blue-400"
          ></textarea>
        </div>

        <button
          className="p-2 bg-amber-400 font-bold m-auto hover:cursor-pointer"
          type="submit"
          onClick={handleSubmit}
        >
          Enviar reseña
        </button>
      </form>
    </div>
  );
};
