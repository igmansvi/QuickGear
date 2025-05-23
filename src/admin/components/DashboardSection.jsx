import React, { useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "./ui/StatCard";
import StatCardSkeleton from "./ui/StatCardSkeleton";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Filler } from "chart.js";
import AdminApiService from "../api/AdminApiService";

ChartJS.register(Filler);

const DashboardSection = ({
  stats,
  chartData,
  products = [],
  bookings = [],
  users = [],
  loading,
  onNotification = () => {},
}) => {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportReport = async () => {
    try {
      setExportLoading(true);

      const exportData = await AdminApiService.analytics.exportReports({
        products: products.length,
        bookings: bookings.length,
        users: users.length,
      });

      AdminApiService.utils.downloadJsonFile(
        exportData,
        "quickgear_reports.json"
      );

      onNotification("Report exported successfully", "success");
    } catch (error) {
      console.error("Error exporting report:", error);
      onNotification("Failed to export report", "error");
    } finally {
      setExportLoading(false);
    }
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: chartData?.bookingTrends?.labels || [],
    datasets: [
      {
        label: "Bookings",
        data: chartData?.bookingTrends?.counts || [],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const barChartData = {
    labels: chartData?.revenue?.labels || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: chartData?.revenue?.amounts || [],
        backgroundColor: "#84cc16",
        borderColor: "#65a30d",
        borderWidth: 1,
      },
    ],
  };

  const renderLineChart = () => {
    try {
      if (!chartData?.bookingTrends?.labels?.length) {
        return (
          <div className="flex h-64 items-center justify-center text-gray-500">
            <p>No booking trend data available</p>
          </div>
        );
      }
      return <Line options={lineChartOptions} data={lineChartData} />;
    } catch (error) {
      console.error("Error rendering line chart:", error);
      return (
        <div className="flex h-64 items-center justify-center text-red-500">
          <p>Error loading chart data</p>
        </div>
      );
    }
  };

  const renderBarChart = () => {
    try {
      if (!chartData?.revenue?.labels?.length) {
        return (
          <div className="flex h-64 items-center justify-center text-gray-500">
            <p>No revenue data available</p>
          </div>
        );
      }
      return <Bar options={barChartOptions} data={barChartData} />;
    } catch (error) {
      console.error("Error rendering bar chart:", error);
      return (
        <div className="flex h-64 items-center justify-center text-red-500">
          <p>Error loading chart data</p>
        </div>
      );
    }
  };

  const getPopularProducts = () => {
    if (!products.length || !bookings.length) return [];

    const productBookingCounts = {};
    bookings.forEach((booking) => {
      const productId = booking.product_id;
      productBookingCounts[productId] =
        (productBookingCounts[productId] || 0) + 1;
    });

    return products
      .map((product) => ({
        ...product,
        bookingCount: productBookingCounts[product.id] || 0,
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 5);
  };

  const popularProducts = getPopularProducts();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="fa-box"
          bgClass="bg-blue-100"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="fa-calendar-check"
          bgClass="bg-green-100"
          iconColor="text-green-500"
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers}
          icon="fa-users"
          bgClass="bg-purple-100"
          iconColor="text-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString() || "0"}`}
          icon="fa-rupee-sign"
          bgClass="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => document.getElementById("add-product-btn")?.click()}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center transition duration-300 hover:shadow-md"
          >
            <i className="fas fa-plus-circle text-blue-500 text-2xl mb-2"></i>
            <span className="text-gray-700">Add New Product</span>
          </button>
          <button
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center transition duration-300 hover:shadow-md"
            onClick={handleExportReport}
            disabled={exportLoading}
          >
            {exportLoading ? (
              <>
                <i className="fas fa-spinner fa-spin text-green-500 text-2xl mb-2"></i>
                <span className="text-gray-700">Exporting...</span>
              </>
            ) : (
              <>
                <i className="fas fa-file-export text-green-500 text-2xl mb-2"></i>
                <span className="text-gray-700">Export Reports</span>
              </>
            )}
          </button>
          <button
            onClick={() => document.getElementById("tab-settings")?.click()}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center transition duration-300 hover:shadow-md"
          >
            <i className="fas fa-cog text-purple-500 text-2xl mb-2"></i>
            <span className="text-gray-700">System Settings</span>
          </button>
          <a
            href="https://support.quickgear.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex flex-col items-center transition duration-300 hover:shadow-md"
          >
            <i className="fas fa-question-circle text-yellow-500 text-2xl mb-2"></i>
            <span className="text-gray-700">Help & Support</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
          <div className="h-64">{renderLineChart()}</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
          <div className="h-64">{renderBarChart()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Recent Bookings</h3>
            <Link
              to="#"
              onClick={() => document.getElementById("tab-bookings")?.click()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            {bookings && bookings.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.slice(0, 5).map((booking) => {
                    const product = products.find(
                      (p) => p.id === booking.product_id
                    );
                    const user = users.find((u) => u.id === booking.user_id);
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3 whitespace-nowrap">
                          {booking.id}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {product ? product.name : "Unknown Product"}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          {user ? user.full_name : "Unknown User"}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-calendar-alt text-gray-300 text-4xl mb-2"></i>
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Popular Products</h3>
            <Link
              to="#"
              onClick={() => document.getElementById("tab-products")?.click()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <i
                      className={`fas fa-${
                        product.category === "camera" ? "camera" : "tools"
                      } text-gray-500`}
                    ></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {product.category}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm font-semibold text-gray-900">
                    {product.bookingCount} bookings
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-box text-gray-300 text-4xl mb-2"></i>
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
