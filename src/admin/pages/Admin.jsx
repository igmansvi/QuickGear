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

  const handleModalState = (modalType, isOpen, data = null) => {
    switch (modalType) {
      case "product":
        setProductModalOpen(isOpen);
        if (data) setSelectedProduct(data);
        break;
      case "booking":
        setBookingModalOpen(isOpen);
        if (data) setSelectedBooking(data);
        break;
      case "user":
        setUserModalOpen(isOpen);
        if (data) setSelectedUser(data);
        break;
      case "deleteProduct":
        setDeleteProductModalOpen(isOpen);
        if (data) setSelectedProduct(data);
        break;
      default:
        break;
    }
  };

  const handleUpdateProduct = async (updatedProduct) => {
    try {
      setLoading(true);
      const result = await AdminApiService.products.update(
        updatedProduct.id,
        updatedProduct
      );
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? result : p))
      );
      handleModalState("product", false);
      addNotification("Product updated successfully", "success");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error updating product:", error);
      addNotification("Error updating product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const updatedBooking = await AdminApiService.bookings.updateStatus(
        bookingId,
        newStatus
      );

      if (updatedBooking.success === false) {
        throw new Error(
          updatedBooking.message || "Failed to update booking status"
        );
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === parseInt(bookingId) ? updatedBooking : booking
        )
      );

      setBookingModalOpen(false);

      addNotification(
        `Booking #${bookingId} status updated to ${newStatus}`,
        "success"
      );

      const dashboardStats = await AdminApiService.dashboard.getStats();
      setStats(dashboardStats);

      if (activeTab === "tab-dashboard") {
        const charts = await AdminApiService.dashboard.getChartData();
        setChartData(charts);
      }

    } catch (error) {
      console.error("Error updating booking status:", error);
      addNotification(
        error.message || "Error updating booking status",
        "error"
      );
    } finally {
      setLoading(false);
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
      const newProduct = await AdminApiService.products.add(productData);
      setProducts([...products, newProduct]);
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
      const dashboardStats = await AdminApiService.dashboard.getStats();
      setStats(dashboardStats);
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
    handleModalState("product", false);
    handleModalState("booking", false);
    handleModalState("user", false);
    handleModalState("deleteProduct", false);
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

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      setLoading(true);
      const updatedUser = await AdminApiService.users.updateStatus(
        userId,
        newStatus
      );
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...updatedUser, password: undefined } : u
        )
      );
      addNotification(`User status updated to ${newStatus}`, "success");
      if (userDetails && selectedUser && selectedUser.id === userId) {
        const refreshedUserDetails = await AdminApiService.users.getStats(
          userId
        );
        setUserDetails(refreshedUserDetails);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      addNotification("Error updating user status", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async (dataType, format = "json") => {
    try {
      setLoading(true);

      let exportData;
      let filename;

      switch (dataType) {
        case "products":
          exportData = products;
          filename = `products-export-${new Date().toISOString().slice(0, 10)}`;
          break;
        case "bookings":
          exportData = bookings;
          filename = `bookings-export-${new Date().toISOString().slice(0, 10)}`;
          break;
        case "users":
          exportData = users;
          filename = `users-export-${new Date().toISOString().slice(0, 10)}`;
          break;
        default:
          throw new Error("Invalid data type for export");
      }

      if (format === "csv") {
        AdminApiService.utils.downloadCsvFile(exportData, `${filename}.csv`);
      } else {
        AdminApiService.utils.downloadJsonFile(exportData, `${filename}.json`);
      }

      addNotification(
        `${dataType} exported successfully as ${format.toUpperCase()}`,
        "success"
      );
    } catch (error) {
      console.error(`Error exporting ${dataType}:`, error);
      addNotification(`Error exporting ${dataType}`, "error");
    } finally {
      setLoading(false);
    }
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
            onExportData={handleExportData}
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
            onExport={(format) => handleExportData("products", format)}
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
            onUpdateStatus={handleUpdateUserStatus}
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
