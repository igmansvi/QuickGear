import React, { useState } from "react";
import Modal from "../ui/Modal";

const ReviewModal = ({ booking, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleRatingHover = (value) => {
    setHoverRating(value);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, reviewText);
    }
  };

  return (
    <Modal onClose={onClose} size="sm">
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="mx-auto rounded-full bg-yellow-100 w-16 h-16 flex items-center justify-center mb-4">
            <i className="fas fa-star text-yellow-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold mb-2">Leave a Review</h2>
          <p className="text-gray-600">{booking.product_name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg">
              <div
                className="rating flex space-x-1"
                onMouseLeave={handleRatingLeave}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <i
                    key={value}
                    className={`fas fa-star text-2xl cursor-pointer transition-all duration-200 ${
                      (hoverRating || rating) >= value
                        ? "text-yellow-400 transform scale-110"
                        : "text-gray-300"
                    } hover:text-yellow-400`}
                    onClick={() => handleRatingClick(value)}
                    onMouseEnter={() => handleRatingHover(value)}
                  ></i>
                ))}
              </div>
              <span className="ml-2 font-medium">
                {rating > 0 ? `${rating}/5` : "Select rating"}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="review_text"
              className="block text-gray-700 font-medium mb-2"
            >
              Your Review
            </label>
            <textarea
              id="review_text"
              rows="4"
              required
              placeholder="Share your experience with this equipment..."
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 resize-none"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 ${
                rating === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:-translate-y-0.5"
              }`}
              disabled={rating === 0}
            >
              <i className="fas fa-paper-plane mr-2"></i> Submit Review
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReviewModal;
