import React, { useState } from "react";
import BookingItem from "./BookingItem";
import CancelModal from "./CancelModal";
import ReviewModal from "./ReviewModal";

const UserBookings = ({ bookings, onCancelBooking, onSubmitReview }) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleOpenCancelModal = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelBooking = () => {
    if (selectedBooking) {
      onCancelBooking(selectedBooking.id);
      setShowCancelModal(false);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (rating, reviewText) => {
    if (selectedBooking) {
      onSubmitReview({
        bookingId: selectedBooking.id,
        productId: selectedBooking.product_id,
        rating,
        reviewText,
      });
      setShowReviewModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg h-full">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-bold flex items-center">
          <i className="fas fa-calendar-alt text-blue-600 mr-2"></i>
          My Bookings
        </h2>

        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}{" "}
          found
        </span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50/50 rounded-lg">
          <div className="animate-bounce mb-4">
            <i className="fas fa-calendar-times text-gray-400 text-5xl mb-3"></i>
          </div>
          <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
          <a
            href="/browse"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <i className="fas fa-search mr-2"></i> Browse Equipment
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <BookingItem
              key={booking.id}
              booking={booking}
              onCancel={handleOpenCancelModal}
              onReview={handleOpenReviewModal}
            />
          ))}
        </div>
      )}

      {showCancelModal && (
        <CancelModal
          booking={selectedBooking}
          onCancel={handleCancelBooking}
          onClose={() => setShowCancelModal(false)}
        />
      )}

      {showReviewModal && (
        <ReviewModal
          booking={selectedBooking}
          onSubmit={handleSubmitReview}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

export default UserBookings;
