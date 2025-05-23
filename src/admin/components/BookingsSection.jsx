import React, { useState, useEffect } from "react";
import StatCard from "./ui/StatCard";

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Booking Management
        </h2>
        <p className="text-gray-600">
          Track and manage all bookings from your customers
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product or user..."
              className="w-full border rounded-lg pl-10 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pl-8 pr-10 bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.5em_1.5em]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
            }}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border rounded-lg pl-10 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="From Date"
              max={dateTo || undefined}
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <i className="fas fa-calendar-alt"></i>
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border rounded-lg pl-10 px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="To Date"
              min={dateFrom || undefined}
            />
          </div>

          <button
            onClick={filterBookings}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow flex items-center"
          >
            <i className="fas fa-filter mr-2"></i> Apply
          </button>

          <button
            onClick={resetFilters}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow flex items-center"
          >
            <i className="fas fa-sync-alt mr-2"></i> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bookings"
          value={bookingStats.total}
          icon="fa-calendar"
          bgClass="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Pending"
          value={bookingStats.pending}
          icon="fa-clock"
          bgClass="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Completed"
          value={bookingStats.completed}
          icon="fa-check-circle"
          bgClass="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Cancelled"
          value={bookingStats.cancelled}
          icon="fa-ban"
          bgClass="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Product
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Rental Period
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => {
              const product = products.find((p) => p.id === booking.product_id);
              const user = users.find((u) => u.id === booking.user_id);
              const { rentalDays, totalAmount } = getBookingDetails(booking);

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="py-3 px-4">{booking.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <i
                          className={`fas fa-${
                            product?.category === "camera" ? "camera" : "tools"
                          } text-gray-500`}
                        ></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {product ? product.name : "Unknown Product"}
                        </div>
                        <div className="text-xs text-gray-500">
                          ₹{product ? product.price.toLocaleString() : 0}/day
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {user ? user.full_name : "Unknown User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user ? user.email : ""}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </div>
                      <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {rentalDays} days
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                      <div className="mt-1 text-sm font-semibold text-gray-700">
                        ₹{totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center"
                      onClick={() => onUpdateStatus(booking)}
                    >
                      <i className="fas fa-edit mr-1.5"></i> Update
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
