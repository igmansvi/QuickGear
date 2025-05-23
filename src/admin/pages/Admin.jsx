import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminApiService from "../api/AdminApiService";
import AdminHeader from "../components/AdminHeader";
import AdminTabs from "../components/AdminTabs";
import DashboardSection from "../components/DashboardSection";
import ProductsSection from "../components/ProductsSection";
import BookingsSection from "../components/BookingsSection";
import UsersSection from "../components/UsersSection";
import ProductEditModal from "../components/modals/ProductEditModal";
import BookingStatusModal from "../components/modals/BookingStatusModal";
import UserDetailsModal from "../components/modals/UserDetailsModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab-dashboard");
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState({
    bookingTrends: { labels: [], counts: [] },
    revenue: { labels: [], amounts: [] },
  });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user && user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchAllData();
  }, [isAuthenticated, user, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const productsData = await AdminApiService.products.getAll();
      setProducts(productsData);

      const bookingsData = await AdminApiService.bookings.getAll();
      setBookings(bookingsData);

      const usersData = await AdminApiService.users.getAll();
      setUsers(usersData);

      const dashboardStats = await AdminApiService.dashboard.getStats();
      setStats(dashboardStats);

      const charts = await AdminApiService.dashboard.getChartData();
      setChartData(charts);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      addNotification("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await AdminApiService.products.update(updatedProduct.id, updatedProduct);
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setProductModalOpen(false);
      addNotification("Product updated successfully", "success");
    } catch (error) {
      console.error("Error updating product:", error);
      addNotification("Error updating product", "error");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await AdminApiService.bookings.updateStatus(bookingId, newStatus);
      setBookings(
        bookings.map((b) =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      setBookingModalOpen(false);
      addNotification("Booking status updated successfully", "success");
    } catch (error) {
      console.error("Error updating booking status:", error);
      addNotification("Error updating booking status", "error");
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const userStats = await AdminApiService.users.getStats(userId);
      setUserDetails(userStats);
      setUserModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      addNotification("Error loading user details", "error");
    }
  };

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }, 5000);
  };

  if (!isAuthenticated || (user && user.role !== "admin")) {
    return <div>Access denied. Redirecting...</div>;
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <AdminHeader username={user?.full_name || "Admin"} />

      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="container mx-auto py-8 px-4">
        {/* Notification area */}
        <div className="fixed top-20 right-4 z-50">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`mb-2 p-3 rounded shadow-lg ${
                notification.type === "success"
                  ? "bg-green-100 border-l-4 border-green-500 text-green-700"
                  : notification.type === "error"
                  ? "bg-red-100 border-l-4 border-red-500 text-red-700"
                  : "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
              }`}
            >
              <div className="flex justify-between">
                <p>{notification.message}</p>
                <button
                  onClick={() =>
                    setNotifications(
                      notifications.filter((n) => n.id !== notification.id)
                    )
                  }
                  className="ml-4 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Tab */}
        <div
          id="tab-dashboard"
          className={`tab-content ${
            activeTab !== "tab-dashboard" ? "hidden" : ""
          }`}
        >
          <DashboardSection
            loading={loading}
            stats={stats}
            chartData={chartData}
          />
        </div>

        {/* Products Tab */}
        <div
          id="tab-products"
          className={`tab-content ${
            activeTab !== "tab-products" ? "hidden" : ""
          }`}
        >
          <ProductsSection
            products={products}
            loading={loading}
            onEditProduct={(product) => {
              setSelectedProduct(product);
              setProductModalOpen(true);
            }}
          />
        </div>

        {/* Bookings Tab */}
        <div
          id="tab-bookings"
          className={`tab-content ${
            activeTab !== "tab-bookings" ? "hidden" : ""
          }`}
        >
          <BookingsSection
            bookings={bookings}
            products={products}
            users={users}
            loading={loading}
            onUpdateStatus={(booking) => {
              setSelectedBooking(booking);
              setBookingModalOpen(true);
            }}
          />
        </div>

        {/* Users Tab */}
        <div
          id="tab-users"
          className={`tab-content ${activeTab !== "tab-users" ? "hidden" : ""}`}
        >
          <UsersSection
            users={users}
            loading={loading}
            onViewDetails={(user) => {
              setSelectedUser(user);
              handleViewUserDetails(user.id);
            }}
          />
        </div>
      </main>

      {/* Modals */}
      {productModalOpen && selectedProduct && (
        <ProductEditModal
          product={selectedProduct}
          onClose={() => setProductModalOpen(false)}
          onSave={handleUpdateProduct}
        />
      )}

      {bookingModalOpen && selectedBooking && (
        <BookingStatusModal
          booking={selectedBooking}
          onClose={() => setBookingModalOpen(false)}
          onUpdate={handleUpdateBookingStatus}
        />
      )}

      {userModalOpen && selectedUser && userDetails && (
        <UserDetailsModal
          user={selectedUser}
          userDetails={userDetails}
          onClose={() => setUserModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
