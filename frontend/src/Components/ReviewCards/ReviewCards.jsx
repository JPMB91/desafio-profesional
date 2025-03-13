import React from "react";
import { StarRating } from "../StarRating/StarRating";
import { UserAvatar } from "../UserAvatar/UserAvatar";

export const ReviewCards = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex items-center mb-3">
        <div className="h-10 w-10 rounded-full mr-4">
          <UserAvatar name={review.userName} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{review.userName}</h3>
          <div className="text-xs text-gray-500">
            {review.createdAt
              ? new Date(review.createdAt).toLocaleDateString()
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
  );
};
