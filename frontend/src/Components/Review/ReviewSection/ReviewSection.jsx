import { useLocation, useNavigate } from "react-router-dom";

import { ReviewAddForm } from "../ReviewAddForm/ReviewAddForm";
import { ReviewCards } from "../ReviewCards/ReviewCards";
import { useEffect, useRef, useState } from "react";
import { Pagination } from "../../UI/Pagination/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import axios from "axios";
import { useAuth } from "../../../context/Auth.Context";

export const ReviewSection = ({ vehicleId, onRatingUpdate }) => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewsUpdated, setReviewsUpdated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation()

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePrevPage,
    handleNextPage,
    handlePageClick,
    handlePageReset,
  } = usePagination({
    totalItems: reviews.length,
    itemsPerPage: 4,
  });

  const currentReviews = reviews.slice(startIndex, endIndex);

  const reviewsRef = useRef(null);

  useEffect(() => {
    if (location.state?.source === "reviews") {
      if (
        reviewsRef.current &&
        typeof reviewsRef.current.scrollIntoView === "function"
      ) {
        setTimeout(() => {
          reviewsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [currentPage]);

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
        setError("Error obteniendo las reseñas");
        setLoading(false);
      }
    };

    getReviews();
  }, [vehicleId, reviewsUpdated]);

  const handleLoginRedirect = () => {
    navigate("/login", {
      state: { from: `/vehicle/${vehicleId}`, source: "reviews" },
    });
  };

  const handleReviewAdded = () => {
    setReviewsUpdated((prev) => !prev);
    if(onRatingUpdate){
      onRatingUpdate()
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" ref={reviewsRef}>
      <h2 className="text-2xl font-bold mb-6 ">Opiniones de Clientes</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {!isAuthenticated ? (
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Dejar una Reseña
              </h3>
              <div className="text-center">
                <p className="mb-4 text-gray-600">
                  Necesitas iniciar sesión para dejar una reseña
                </p>
                <button
                  className="w-full p-2 bg-[#FF5F00] font-bold text-white rounded hover:cursor-pointer hover:bg-[var(--color-accent-primary-hover)] transition-colors"
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
          {loading ? (
            <div className="text-center py-8">Cargando reseñas...</div>
          ) : error ? (
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
              {currentReviews.map((review) => (
                <ReviewCards key={review.reviewId} review={review} />
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageClick}
              onPageReset={handlePageReset}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};
