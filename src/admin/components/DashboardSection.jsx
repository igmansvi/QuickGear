import React from "react";
import { Line, Bar } from "react-chartjs-2";
import StatCard from "./ui/StatCard";

const DashboardSection = ({ loading, stats, chartData }) => {
  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  const bookingTrendsChartData = {
    labels: chartData.bookingTrends.labels,
    datasets: [
      {
        label: "Bookings",
        data: chartData.bookingTrends.counts,
        borderColor: "rgb(59, 130, 246)",
        tension: 0.1,
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
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          borderClass="border-blue-500"
          bgClass="bg-blue-100"
          iconColor="text-blue-500"
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
          borderClass="border-purple-500"
          bgClass="bg-purple-100"
          iconColor="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Booking Trends</h3>
          <div style={{ height: "300px" }}>
            <Line data={bookingTrendsChartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Revenue Overview</h3>
          <div style={{ height: "300px" }}>
            <Bar data={revenueChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSection;
