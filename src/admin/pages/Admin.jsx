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
import SettingsSection from "../components/SettingsSection";
import ProductEditModal from "../components/modals/ProductEditModal";
import BookingStatusModal from "../components/modals/BookingStatusModal";
import UserDetailsModal from "../components/modals/UserDetailsModal";
import DeleteProductConfirmation from "../components/modals/DeleteProductConfirmation";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import ErrorDisplay from "../components/ui/ErrorDisplay";

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
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab-dashboard");
  const [products, setProducts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin()) {
      navigate("/");
      return;
    }

    fetchAllData();
  }, [isAuthenticated, isAdmin, navigate, refreshTrigger]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
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
      setError("Failed to load dashboard data. Please try again later.");
      addNotification("Error loading data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    window.location.hash = tabId;

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (
      hash &&
      [
        "tab-dashboard",
        "tab-products",
        "tab-bookings",
        "tab-users",
        "tab-settings",
      ].includes(hash)
    ) {
      setActiveTab(hash);
    }
  }, []);

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      await AdminApiService.products.update(updatedProduct.id, updatedProduct);
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setProductModalOpen(false);
      addNotification("Product updated successfully", "success");
      setRefreshTrigger((prev) => prev + 1);
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
      setRefreshTrigger((prev) => prev + 1);
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

  const handleRefreshData = () => {
    addNotification("Refreshing data...", "info");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddProduct = async (productData) => {
    setLoading(true);
    try {
      await AdminApiService.products.add(productData);
      addNotification("Product added successfully", "success");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error adding product:", error);
      addNotification("Error adding product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true);
      await AdminApiService.products.delete(productId);
      setProducts(products.filter((p) => p.id !== productId));
      addNotification("Product deleted successfully", "success");
      setDeleteProductModalOpen(false);
    } catch (error) {
      console.error("Error deleting product:", error);
      addNotification("Error deleting product", "error");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteProduct = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setDeleteProductModalOpen(true);
    }
  };

  const closeAllModals = () => {
    setProductModalOpen(false);
    setBookingModalOpen(false);
    setUserModalOpen(false);
    setDeleteProductModalOpen(false);
  };

  useEffect(() => {
    return () => {
      closeAllModals();
    };
  }, [activeTab]);

  const addNotification = (message, type = "info") => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    }, 5000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <i className="fas fa-lock text-red-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access the admin panel.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <i className="fas fa-exclamation-triangle text-yellow-500 text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      <AdminHeader
        username={user?.full_name || "Admin"}
        onRefresh={handleRefreshData}
      />

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

        {error && <ErrorDisplay message={error} onRetry={fetchAllData} />}

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
            products={products}
            bookings={bookings}
            users={users}
            onNotification={addNotification}
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
            onAddProduct={handleAddProduct}
            onDeleteProduct={confirmDeleteProduct}
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

        {/* Settings Tab */}
        <div
          id="tab-settings"
          className={`tab-content ${
            activeTab !== "tab-settings" ? "hidden" : ""
          }`}
        >
          <SettingsSection adminUser={user} onNotification={addNotification} />
        </div>
      </main>

      {/* Global loading overlay for major operations */}
      {loading && <LoadingOverlay />}

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

      {/* Delete Product Confirmation Modal */}
      {deleteProductModalOpen && selectedProduct && (
        <DeleteProductConfirmation
          product={selectedProduct}
          isOpen={deleteProductModalOpen}
          onClose={() => setDeleteProductModalOpen(false)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
};

export default Admin;
