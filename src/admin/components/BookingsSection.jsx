import React, { useState, useEffect } from "react";

const BookingsSection = ({
  bookings,
  products,
  users,
  loading,
  onUpdateStatus,
}) => {
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (bookings.length) {
      filterBookings();
    }
  }, [bookings, searchTerm, statusFilter, dateFrom, dateTo]);

  const filterBookings = () => {
    let result = [...bookings];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((booking) => {
        const product = products.find((p) => p.id === booking.product_id);
        const user = users.find((u) => u.id === booking.user_id);

        return (
          (product && product.name.toLowerCase().includes(term)) ||
          (user && user.full_name.toLowerCase().includes(term)) ||
          (user && user.email.toLowerCase().includes(term))
        );
      });
    }

    if (statusFilter) {
      result = result.filter((booking) => booking.status === statusFilter);
    }

    if (dateFrom && dateTo) {
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.start_date);
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);

        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    }

    setFilteredBookings(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
  };

  const bookingStats = {
    total: filteredBookings.length,
    pending: filteredBookings.filter((b) => b.status === "pending").length,
    completed: filteredBookings.filter((b) => b.status === "completed").length,
    cancelled: filteredBookings.filter((b) => b.status === "cancelled").length,
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

  const getBookingDetails = (booking) => {
    const product = products.find((p) => p.id === booking.product_id);
    if (!product) return { rentalDays: 0, totalAmount: 0 };

    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const diffTime = Math.abs(endDate - startDate);
    const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      rentalDays,
      totalAmount: product.price * rentalDays,
    };
  };

  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product or user..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="From Date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="To Date"
          />
          <button
            onClick={filterBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Total Bookings</p>
          <p className="text-xl font-bold">{bookingStats.total}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-xl font-bold">{bookingStats.pending}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Completed</p>
          <p className="text-xl font-bold">{bookingStats.completed}</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-red-600">Cancelled</p>
          <p className="text-xl font-bold">{bookingStats.cancelled}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Product</th>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Rental Period</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => {
              const product = products.find((p) => p.id === booking.product_id);
              const user = users.find((u) => u.id === booking.user_id);
              const { rentalDays, totalAmount } = getBookingDetails(booking);

              return (
                <tr key={booking.id} className="text-center hover:bg-gray-50">
                  <td className="py-1 px-2 border">{booking.id}</td>
                  <td className="py-1 px-2 border">
                    {product ? product.name : "Unknown Product"}
                    <br />
                    <span className="text-xs text-gray-500">
                      ₹{product ? product.price.toLocaleString() : 0}/day
                    </span>
                  </td>
                  <td className="py-1 px-2 border">
                    {user ? user.full_name : "Unknown User"}
                    <br />
                    <span className="text-xs text-gray-500">
                      {user ? user.email : ""}
                    </span>
                  </td>
                  <td className="py-1 px-2 border">
                    {new Date(booking.start_date).toLocaleDateString()} to{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-500">
                      {rentalDays} days
                    </span>
                  </td>
                  <td className="py-1 px-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <br />
                    <span className="text-xs font-semibold text-gray-700">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-1 px-2 border">
                    <button
                      className="text-blue-600 hover:text-blue-800 mx-1"
                      onClick={() => onUpdateStatus(booking)}
                    >
                      <i className="fas fa-edit"></i> Update
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsSection;
