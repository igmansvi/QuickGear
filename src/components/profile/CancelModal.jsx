import React from "react";
import Modal from "../ui/Modal";
import { formatDate } from "../../utils/formatting";

const CancelModal = ({ booking, onCancel, onClose }) => {
  return (
    <Modal onClose={onClose} size="sm">
      <div className="p-6">
        <div className="text-center mb-4">
          <div className="mx-auto rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mb-4">
            <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Cancel Booking</h2>
          <p className="text-gray-600 text-sm">
            Are you sure you want to cancel your booking for:
          </p>
          <p className="font-semibold text-gray-800 mt-1">
            {booking.product_name}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600 flex items-center justify-between mb-1">
            <span>Booking ID:</span>
            <span className="font-medium">#{booking.id}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center justify-between">
            <span>Dates:</span>
            <span>
              {formatDate(booking.start_date, "short")} -{" "}
              {formatDate(booking.end_date, "short")}
            </span>
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-800 text-sm mb-6">
          <p>
            <i className="fas fa-info-circle mr-2"></i>
            This action cannot be undone. Depending on the cancellation policy,
            you may receive a full or partial refund.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-5 rounded-lg transition-colors duration-300"
          >
            Keep Booking
          </button>
          <button
            onClick={onCancel}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg transition-colors duration-300 flex items-center"
          >
            <i className="fas fa-ban mr-2"></i> Yes, Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelModal;
