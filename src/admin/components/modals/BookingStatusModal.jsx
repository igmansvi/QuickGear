import React, { useState } from "react";
import AdminModal from "../ui/AdminModal";

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
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Current Status:</label>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">New Status:</label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default BookingStatusModal;
