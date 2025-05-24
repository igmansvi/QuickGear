import React from "react";
import Modal from "../ui/Modal";
import DateRange from "../ui/DateRange";

const BookingDetailsModal = ({ booking, product, onClose }) => {
  if (!booking) return null;

  const calculateTotalDays = (startDate, endDate) => {
    if (startDate === endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) return 0;

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays + 1;
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

  const totalDays = calculateTotalDays(booking.start_date, booking.end_date);

  const productPrice =
    product && typeof product.price !== "undefined"
      ? product.price
      : booking.product_price || booking.productPrice || 0;

  const totalAmount = productPrice * totalDays;

  const productName =
    (product && product.name) ||
    booking.productName ||
    booking.product_name ||
    "Unknown Product";

  const productImage =
    (product && product.image) ||
    booking.productImage ||
    booking.product_image ||
    "";

  return (
    <Modal onClose={onClose} size="md">
      <div className="relative">
        <div className="h-52 bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden rounded-t-xl">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-50">
              <i className="fas fa-image text-blue-300 text-5xl"></i>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
          aria-label="Close modal"
        >
          <i className="fas fa-times text-gray-700"></i>
        </button>

        <div
          className="absolute bottom-4 left-6 px-4 py-1.5 rounded-lg text-white font-medium text-sm shadow-md"
          style={{ backgroundColor: getStatusColor(booking.status) }}
        >
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-hide flex-1">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {productName}
          </h2>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  Booking ID
                </span>
                <p className="text-gray-800 font-medium">#{booking.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">
                  Booking Date
                </span>
                <p className="text-gray-800">
                  {formatDate(booking.booking_date)}
                </p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500 block mb-1">
                  Rental Period
                </span>
                <div className="flex items-center gap-2">
                  <DateRange
                    startDate={booking.start_date}
                    endDate={booking.end_date}
                  />
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-auto">
                    {totalDays} day{totalDays > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-100">
              <span>Daily Rate</span>
              <span className="font-medium">
                ₹{productPrice ? productPrice.toLocaleString() : "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-700 py-2 border-b border-gray-100">
              <span>Number of Days</span>
              <span className="font-medium">x {totalDays}</span>
            </div>
            <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg text-blue-800 font-semibold">
              <span>Total Amount</span>
              <span>₹{totalAmount ? totalAmount.toLocaleString() : "N/A"}</span>
            </div>
          </div>

          {booking.message && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">
                Additional Notes
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg text-gray-600 text-sm italic border-l-4 border-gray-200">
                "{booking.message}"
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Rental Terms</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Equipment must be returned in its original condition</li>
              <li>Late returns will incur additional charges</li>
              <li>Damage beyond normal wear and tear will be charged</li>
              <li>
                Cancellations with less than 24 hours notice may not be eligible
                for refund
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-gray-100 bg-white">
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
