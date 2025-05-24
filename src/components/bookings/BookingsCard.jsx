import React, { useState } from "react";
import DateRange from "../ui/DateRange";
import StatusBadge from "../ui/StatusBadge";
import BookingDetailsModal from "./BookingDetailsModal";

const BookingsCard = ({ booking, product }) => {
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      available: "#22c55e",
      pending: "#f59e0b",
      confirmed: "#3b82f6",
      completed: "#10b981",
      coming_soon: "#f97316",
      rented: "#ef4444",
      cancelled: "#dc2626",
    };

    return colors[status] || "#9ca3af";
  };

  const formatDate = (dateString, format = "medium") => {
    try {
      const date = new Date(dateString);
      if (isNaN(date)) return "Invalid date";

      const options = {
        short: { month: "short", day: "numeric" },
        medium: { month: "short", day: "numeric", year: "numeric" },
        long: {
          weekday: "short",
          month: "long",
          day: "numeric",
          year: "numeric",
        },
        full: {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      };

      return date.toLocaleDateString(
        "en-US",
        options[format] || options.medium
      );
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString || "N/A";
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-xl overflow-hidden shadow-md transition transform hover:scale-102 hover:shadow-lg hover:-translate-y-1 duration-300">
        <div
          className="absolute top-0 inset-x-0 h-1"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        />

        <div className="h-32 overflow-hidden">
          {booking.productImage ? (
            <img
              src={booking.productImage}
              alt={booking.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <i className="fas fa-image text-gray-300 text-3xl"></i>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {booking.productName}
            </h3>
            <StatusBadge status={booking.status} size="sm" />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-600 flex items-center">
              <i className="fas fa-calendar-day text-blue-500 mr-2 w-5 text-center"></i>
              <DateRange
                startDate={booking.start_date}
                endDate={booking.end_date}
                format="short"
              />
            </div>

            <div className="text-xs text-gray-500 flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2 w-5 text-center"></i>
              <span>
                Booked on: {formatDate(booking.booking_date, "short")}
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleViewDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300 flex items-center gap-1.5 shadow-sm"
            >
              <i className="fas fa-eye"></i> View Details
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <BookingDetailsModal
          booking={booking}
          product={product}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default BookingsCard;
