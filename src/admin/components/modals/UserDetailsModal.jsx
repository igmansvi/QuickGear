import React from "react";
import AdminModal from "../ui/AdminModal";

const UserDetailsModal = ({ user, userDetails, onClose }) => {
  const { stats, bookings } = userDetails;

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
    <AdminModal onClose={onClose} size="md">
      <div className="text-center mb-6">
        <div className="mx-auto rounded-full bg-gradient-to-r from-blue-50 to-blue-100 w-16 h-16 flex items-center justify-center mb-4 shadow-inner">
          <i className="fas fa-user text-blue-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold mb-2">{user.full_name}</h2>
        <p className="text-gray-600 mb-2">{user.email}</p>
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 rounded-full text-sm font-medium shadow-sm">
          {user.role || "User"}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
          User Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-xs text-gray-500 mb-1">Email</div>
            <div className="font-medium text-gray-800">{user.email}</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-xs text-gray-500 mb-1">Phone</div>
            <div className="font-medium text-gray-800">
              {user.phone || "N/A"}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-xs text-gray-500 mb-1">Join Date</div>
            <div className="font-medium text-gray-800">
              {new Date(user.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="font-medium text-green-600">Active</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
          Booking Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-2xl font-bold text-blue-600">
              {stats?.total_bookings || 0}
            </div>
            <div className="text-xs text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-2xl font-bold text-green-600">
              {stats?.completed_bookings || 0}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-2xl font-bold text-red-600">
              {stats?.cancelled_bookings || 0}
            </div>
            <div className="text-xs text-gray-600">Cancelled</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="text-2xl font-bold text-yellow-600">
              ₹{(stats?.total_spent || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
          Recent Bookings
        </h3>
        <div className="max-h-60 overflow-y-auto rounded-lg shadow-sm bg-gradient-to-r from-gray-50 to-white">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <div
                key={index}
                className="border-b border-gray-100 p-3 hover:bg-blue-50 transition-colors duration-300"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{booking.product_name}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(
                      booking.status
                    )} shadow-sm`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>
                    {new Date(booking.start_date).toLocaleDateString()} to{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </span>
                  <span className="text-gray-500">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-calendar-times text-gray-400 text-2xl mb-2"></i>
              <p>No bookings found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
        >
          Close
        </button>
      </div>
    </AdminModal>
  );
};

export default UserDetailsModal;
