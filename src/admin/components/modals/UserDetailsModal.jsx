import React from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">User Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {user.full_name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Join Date:</span>{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Total Bookings:</span>{" "}
              {stats?.total_bookings || 0}
            </p>
            <p>
              <span className="font-semibold">Completed Bookings:</span>{" "}
              {stats?.completed_bookings || 0}
            </p>
            <p>
              <span className="font-semibold">Cancelled Bookings:</span>{" "}
              {stats?.cancelled_bookings || 0}
            </p>
            <p>
              <span className="font-semibold">Total Spent:</span> ₹
              {(stats?.total_spent || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recent Bookings</h4>
          <div className="max-h-60 overflow-y-auto">
            {bookings && bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div key={index} className="border-b p-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">
                      {booking.product_name}
                    </span>
                    <span className="text-sm">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>
                      {new Date(booking.start_date).toLocaleDateString()} to{" "}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No bookings found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
