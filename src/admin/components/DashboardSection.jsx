import React from "react";
import { Line, Bar } from "react-chartjs-2";
import StatCard from "./ui/StatCard";
import StatCardSkeleton from "./ui/StatCardSkeleton";

const DashboardSection = ({ loading, stats, chartData }) => {
  const bookingTrendsChartData = {
    labels: chartData.bookingTrends.labels,
    datasets: [
      {
        label: "Bookings",
        data: chartData.bookingTrends.counts,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const revenueChartData = {
    labels: chartData.revenue.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: chartData.revenue.amounts,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        intersect: false,
        mode: "index",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const chartContainerStyle = {
    height: "300px",
    width: "100%",
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Here's a summary of your business
          performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          // Show skeletons while loading
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          // Show actual stat cards when data is loaded
          <>
            <StatCard
              title="Revenue"
              value={`₹${stats.totalRevenue?.toLocaleString() || 0}`}
              icon="fa-indian-rupee-sign"
              borderClass="border-blue-500"
              bgClass="bg-blue-100"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts || 0}
              icon="fa-box"
              borderClass="border-purple-500"
              bgClass="bg-purple-100"
              iconColor="text-purple-500"
            />
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings || 0}
              icon="fa-calendar-check"
              borderClass="border-green-500"
              bgClass="bg-green-100"
              iconColor="text-green-500"
            />
            <StatCard
              title="Total Users"
              value={stats.totalUsers || 0}
              icon="fa-users"
              borderClass="border-yellow-500"
              bgClass="bg-yellow-100"
              iconColor="text-yellow-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
          <div style={chartContainerStyle}>
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-400">
                  <i className="fas fa-chart-line text-4xl"></i>
                </div>
              </div>
            ) : (
              <Line data={bookingTrendsChartData} options={chartOptions} />
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
          <div style={chartContainerStyle}>
            {loading ? (
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-400">
                  <i className="fas fa-chart-bar text-4xl"></i>
                </div>
              </div>
            ) : (
              <Bar data={revenueChartData} options={chartOptions} />
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg flex flex-col items-center transition duration-300">
            <i className="fas fa-plus-circle text-blue-500 text-2xl mb-2"></i>
            <span className="text-gray-700">Add New Product</span>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg flex flex-col items-center transition duration-300">
            <i className="fas fa-file-export text-green-500 text-2xl mb-2"></i>
            <span className="text-gray-700">Export Reports</span>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg flex flex-col items-center transition duration-300">
            <i className="fas fa-cog text-purple-500 text-2xl mb-2"></i>
            <span className="text-gray-700">System Settings</span>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg flex flex-col items-center transition duration-300">
            <i className="fas fa-question-circle text-yellow-500 text-2xl mb-2"></i>
            <span className="text-gray-700">Help & Support</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardSection;
