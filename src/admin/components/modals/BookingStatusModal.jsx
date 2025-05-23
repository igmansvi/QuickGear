import React, { useState } from "react";
import AdminModal from "./AdminModal";

const BookingStatusModal = ({ booking, onClose, onUpdate }) => {
  const [newStatus, setNewStatus] = useState(booking.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(booking.id, newStatus);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AdminModal title="Update Booking Status" onClose={onClose} size="sm">
      <div className="text-center mb-6">
        <div className="mx-auto rounded-full bg-gradient-to-r from-blue-50 to-blue-100 w-16 h-16 flex items-center justify-center mb-4 shadow-inner">
          <i className="fas fa-calendar-alt text-blue-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2">Booking #{booking.id}</h3>
        <p className="text-gray-600 mb-2">Update the status of this booking</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Current Status
          </label>
          <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg flex items-center justify-center shadow-inner">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
                booking.status
              )}`}
            >
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            New Status
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300 border border-gray-300 shadow-sm hover:shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            <i className="fas fa-check mr-2"></i> Update Status
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default BookingStatusModal;
