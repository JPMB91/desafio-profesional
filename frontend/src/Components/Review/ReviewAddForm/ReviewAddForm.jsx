import { useState } from "react";

import axios from "axios";
import { useAuth } from "../../../context/Auth.Context";
import { StarRating } from "../../UI/StarRating/StarRating";

export const ReviewAddForm = ({ user, vehicleId, onReviewAdded }) => {
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState({ emptyRating: "", general: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRating === 0) {
      setError({
        ...error,
        emptyRating: "La puntuación no puede quedar vacía",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(
        "http://localhost:8080/api/reviews",
        {
          score: userRating,
          comment: comment,
          email: user.sub,
          vehicleId: vehicleId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      <h3 className="text-lg font-semibold mb-4 text-center">
        Dejar una Reseña
      </h3>

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
                  setError({ ...error, emptyRating: "" });
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
          <label
            htmlFor="comment"
            className="block text-gray-700 mb-2 font-medium"
          >
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
