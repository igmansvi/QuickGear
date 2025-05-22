import React from "react";
import { formatDate, getStatusColor } from "../../utils/formatting";
import StatusBadge from "../ui/StatusBadge";
import DateRange from "../ui/DateRange";

const BookingItem = ({ booking, onCancel, onReview }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "check-circle";
      case "pending":
        return "clock";
      case "confirmed":
        return "thumbs-up";
      case "cancelled":
        return "times-circle";
      default:
        return "question-circle";
    }
  };

  const statusClass = `flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[${getStatusColor(
    booking.status
  )}] text-white`;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 h-40 md:h-auto relative overflow-hidden">
          <img
            src={booking.product_image}
            alt={booking.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="w-full md:w-2/3 p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {booking.product_name}
            </h3>
            <span className={statusClass}>
              <i className={`fas fa-${getStatusIcon(booking.status)} mr-1`}></i>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-hashtag text-blue-500 mr-1.5 w-4 text-center"></i>
                Booking ID:{" "}
                <span className="font-medium ml-1">#{booking.id}</span>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-tag text-blue-500 mr-1.5 w-4 text-center"></i>
                Price:{" "}
                <span className="font-medium ml-1">
                  ₹{booking.product_price.toLocaleString()}/day
                </span>
              </p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <p className="text-sm text-gray-600 flex items-center">
                <i className="fas fa-calendar-day text-blue-500 mr-1.5 w-4 text-center"></i>
                <DateRange
                  startDate={booking.start_date}
                  endDate={booking.end_date}
                  format="short"
                />
              </p>
            </div>
            {booking.message && (
              <div className="col-span-1 sm:col-span-2">
                <p className="text-sm text-gray-600 flex items-start">
                  <i className="fas fa-comment text-blue-500 mr-1.5 w-4 text-center mt-1"></i>
                  <span className="line-clamp-2 text-gray-500 italic">
                    {booking.message}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
            {booking.status === "pending" && (
              <button
                type="button"
                onClick={() => onCancel(booking)}
                className="bg-[var(--color-cancelled)] hover:bg-opacity-90 text-white font-medium py-1.5 px-3 text-xs rounded-lg transition-all duration-300 flex items-center shadow-sm hover:shadow hover:-translate-y-0.5"
              >
                <i className="fas fa-ban mr-1"></i> Cancel Booking
              </button>
            )}
            {booking.status === "completed" && !booking.has_review && (
              <button
                className="bg-[var(--color-pending)] hover:bg-opacity-90 text-white font-medium py-1.5 px-3 text-xs rounded-lg transition-all duration-300 flex items-center shadow-sm hover:shadow hover:-translate-y-0.5"
                onClick={() => onReview(booking)}
              >
                <i className="fas fa-star mr-1"></i> Leave Review
              </button>
            )}
            {booking.status === "completed" && booking.has_review && (
              <span className="bg-green-100 text-green-700 border border-green-200 font-medium py-1.5 px-3 text-xs rounded-lg flex items-center">
                <i className="fas fa-check-circle mr-1"></i> Review Submitted
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingItem;
