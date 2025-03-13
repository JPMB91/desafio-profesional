import axios from "axios";
import React, { useEffect, useState } from "react";
import { StarRating } from "../StarRating/StarRating";
import { UserAvatar } from "../UserAvatar/UserAvatar";

export const ReviewCards = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/reviews/vehicle/${vehicleId}`
        );
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        setError("Ha ocurrido un error obteniendo las reseñas");
        setLoading(false);
      }
    };

    getReviews();
  }, [vehicleId]);

  if (loading) {
    return <div className="text-center py-8">Cargando reseñas...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <p className="text-gray-500">
            Sé el primero en dejar una reseña para este vehículo.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
           {/* <h3 className="text-lg font-semibold mb-4">Opiniones ({reviews.length})</h3> */}
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-100"
            >
              <div className="flex items-center mb-">
                <div className="h-10 w-10 rounded-full mr-4 mb-3">
                  <UserAvatar name={review.userName} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {review.userName}
                  </h3>
                  <div className="text-xs text-gray-500">
                    {review.date
                      ? new Date(review.date).toLocaleDateString()
                      : "Cliente verificado"}
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <StarRating readOnly={true} value={review.score} />
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {review.score}/5
                </span>
              </div>

              <div className="border-b border-gray-100 mb-4"></div>

              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
