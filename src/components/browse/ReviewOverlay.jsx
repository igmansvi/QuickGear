import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const ReviewOverlay = ({ reviews }) => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { user } = useAuth();

  const displayReviews = Array.isArray(reviews) ? reviews.slice(0, 3) : [];

  useEffect(() => {
    if (displayReviews.length <= 1) return;

    const interval = setInterval(() => {
      handleNextReview();
    }, 3000);

    return () => clearInterval(interval);
  }, [displayReviews]);

  const handleNextReview = () => {
    if (isTransitioning || displayReviews.length <= 1) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentReview((prev) => (prev + 1) % displayReviews.length);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSelectReview = (index) => {
    if (isTransitioning || index === currentReview) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentReview(index);
      setIsTransitioning(false);
    }, 300);
  };

  if (!displayReviews || displayReviews.length === 0) return null;

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <i
          key={i}
          className={`fas fa-star text-xs ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        ></i>
      ));
  };

  const currentReviewItem = displayReviews[currentReview];
  if (!currentReviewItem) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
      <div
        className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-3 pointer-events-auto 
                   transition-opacity duration-300 ease-in-out ${
                     isTransitioning ? "opacity-0" : "opacity-100"
                   }`}
      >
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
            <i className="fas fa-quote-right text-blue-500 text-xs"></i>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {renderStars(currentReviewItem.rating)}
              </div>
              <div className="text-xs font-medium text-blue-600 truncate">
                {currentReviewItem.user_name || "User"}
              </div>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2 italic hover:line-clamp-none transition-all duration-200">
              "{currentReviewItem.review_text}"
            </p>
            <div className="mt-1 text-xs text-gray-500 flex justify-between items-center">
              <div>
                {new Date(currentReviewItem.created_at).toLocaleDateString()}
              </div>
              {displayReviews.length > 1 && (
                <div className="flex gap-1">
                  {displayReviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectReview(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300
                        ${i === currentReview ? "bg-blue-500" : "bg-gray-300"}
                        hover:bg-blue-400`}
                    ></button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOverlay;
