import data from "../../api/staticDB/data.json";

const AdminApiService = {
  dashboard: {
    getStats: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pendingBookings = data.bookings.filter(
        (b) => b.status === "pending"
      ).length;
      const totalRevenue = data.bookings
        .filter((b) => b.status !== "cancelled")
        .reduce((total, booking) => {
          const product = data.products.find(
            (p) => p.id === booking.product_id
          );
          if (product) {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const days = Math.floor(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            return total + product.price * days;
          }
          return total;
        }, 0);

      return {
        totalProducts: data.products.length,
        totalBookings: data.bookings.length,
        totalUsers: data.users.filter((u) => u.role !== "admin").length,
        pendingBookings,
        totalRevenue,
      };
    },

    getChartData: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const last6Months = [];
      const currentDate = new Date();

      for (let i = 5; i >= 0; i--) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        const monthName = month.toLocaleString("default", { month: "short" });
        last6Months.push({
          month: monthName,
          year: month.getFullYear(),
          monthIndex: month.getMonth(),
        });
      }

      const bookingTrendsData = last6Months.map((m) => {
        return {
          month: m.month,
          count: data.bookings.filter((b) => {
            const bookingDate = new Date(b.booking_date);
            return (
              bookingDate.getMonth() === m.monthIndex &&
              bookingDate.getFullYear() === m.year
            );
          }).length,
        };
      });

      const revenueData = last6Months.map((m) => {
        const monthBookings = data.bookings.filter((b) => {
          const bookingDate = new Date(b.booking_date);
          return (
            bookingDate.getMonth() === m.monthIndex &&
            bookingDate.getFullYear() === m.year &&
            b.status !== "cancelled"
          );
        });

        let monthRevenue = 0;
        monthBookings.forEach((booking) => {
          const product = data.products.find(
            (p) => p.id === booking.product_id
          );
          if (product) {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const days = Math.floor(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            monthRevenue += product.price * days;
          }
        });

        return {
          month: m.month,
          revenue: monthRevenue,
        };
      });

      return {
        bookingTrends: {
          labels: bookingTrendsData.map((item) => item.month),
          counts: bookingTrendsData.map((item) => item.count),
        },
        revenue: {
          labels: revenueData.map((item) => item.month),
          amounts: revenueData.map((item) => item.revenue),
        },
      };
    },
  },

  products: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.products];
    },

    update: async (productId, productData) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const productIndex = data.products.findIndex(
          (p) => p.id === parseInt(productId)
        );
        if (productIndex === -1) {
          throw new Error("Product not found");
        }

        const updatedProduct = {
          ...data.products[productIndex],
          ...productData,
          id: parseInt(productId),
        };

        console.log("Admin - Updating product:", updatedProduct);
        return updatedProduct;
      } catch (error) {
        return AdminApiService.errorHandler(error, "Error updating product");
      }
    },

    add: async (productData) => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      let imageUrl = null;
      if (productData.image) {
        const fileName = productData.image.name || "product-image.jpg";
        imageUrl = `https://storage.quickgear.com/products/${Date.now()}-${fileName.replace(
          /\s+/g,
          "-"
        )}`;
        console.log("Admin - Image would be uploaded to:", imageUrl);
      }

      const newProduct = {
        id: data.products.length + 1,
        ...productData,
        image_url: imageUrl || productData.image_url || null,
        created_at: new Date().toISOString(),
      };

      if (newProduct.image) {
        delete newProduct.image;
      }

      console.log("Admin - Adding new product:", newProduct);
      return newProduct;
    },

    delete: async (productId) => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const productIndex = data.products.findIndex(
        (p) => p.id === parseInt(productId)
      );
      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      console.log(`Admin - Deleting product with ID: ${productId}`);
      return { success: true, message: "Product deleted successfully" };
    },

    getProductWithConfirmation: async (productId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const product = data.products.find((p) => p.id === parseInt(productId));
      if (!product) {
        throw new Error("Product not found");
      }
      return {
        product,
        confirmationDetails: {
          title: `Delete ${product.name}`,
          message: `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
          dangerLevel: "high",
        },
      };
    },
  },

  bookings: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.bookings];
    },

    getDetails: async (bookingId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const booking = data.bookings.find((b) => b.id === parseInt(bookingId));
      if (!booking) {
        throw new Error("Booking not found");
      }

      const product = data.products.find((p) => p.id === booking.product_id);
      const user = data.users.find((u) => u.id === booking.user_id);

      const startDate = new Date(booking.start_date);
      const endDate = new Date(booking.end_date);
      const rentalDays = Math.ceil(
        Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)
      );

      return {
        ...booking,
        product: product || { name: "Unknown Product", price: 0 },
        user:
          user && user.role !== "admin"
            ? {
                name: user.full_name,
                email: user.email,
                phone: user.phone,
              }
            : { name: "Unknown User", email: "", phone: "" },
        rental_days: rentalDays,
        total_amount: product ? product.price * rentalDays : 0,
      };
    },

    updateStatus: async (bookingId, status) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const bookingIndex = data.bookings.findIndex(
        (b) => b.id === parseInt(bookingId)
      );
      if (bookingIndex === -1) {
        throw new Error("Booking not found");
      }

      const updatedBooking = {
        ...data.bookings[bookingIndex],
        status,
      };

      console.log(`Admin - Updated booking ${bookingId} status to ${status}`);
      return updatedBooking;
    },

    getBookingWithConfirmation: async (bookingId, newStatus) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const booking = data.bookings.find((b) => b.id === parseInt(bookingId));
      if (!booking) {
        throw new Error("Booking not found");
      }

      const product = data.products.find((p) => p.id === booking.product_id);
      const productName = product ? product.name : "Unknown Product";

      let confirmationType = "info";
      let icon = "calendar-check";
      let title = `Update Booking Status`;
      let message = `Are you sure you want to change the status of booking #${bookingId} for ${productName} to ${newStatus}?`;

      if (newStatus === "cancelled") {
        confirmationType = "danger";
        icon = "calendar-times";
        title = "Cancel Booking";
        message = `Are you sure you want to cancel booking #${bookingId} for ${productName}? The customer will be notified of this change.`;
      } else if (newStatus === "completed") {
        confirmationType = "success";
        icon = "check-circle";
        title = "Complete Booking";
        message = `Are you sure you want to mark booking #${bookingId} for ${productName} as completed?`;
      }

      return {
        booking,
        confirmationDetails: {
          title,
          message,
          type: confirmationType,
          icon,
        },
      };
    },

    getStatsByPeriod: async (startDate, endDate) => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      let filteredBookings = data.bookings;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        filteredBookings = data.bookings.filter((booking) => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= start && bookingDate <= end;
        });
      }

      const stats = {
        total: filteredBookings.length,
        pending: filteredBookings.filter((b) => b.status === "pending").length,
        confirmed: filteredBookings.filter((b) => b.status === "confirmed")
          .length,
        completed: filteredBookings.filter((b) => b.status === "completed")
          .length,
        cancelled: filteredBookings.filter((b) => b.status === "cancelled")
          .length,
        revenue: filteredBookings
          .filter((b) => b.status !== "cancelled")
          .reduce((total, booking) => {
            const product = data.products.find(
              (p) => p.id === booking.product_id
            );
            if (product) {
              const startDate = new Date(booking.start_date);
              const endDate = new Date(booking.end_date);
              const days = Math.floor(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
              );
              return total + product.price * days;
            }
            return total;
          }, 0),
      };

      return stats;
    },
  },

  users: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const usersWithStatus = data.users
        .map(({ password, ...user }) => ({
          ...user,
          status: user.status || "active",
        }))
        .filter((user) => user.role !== "admin");

      return usersWithStatus;
    },

    getStats: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const user = data.users.find((u) => u.id === parseInt(userId));
      if (!user) {
        throw new Error("User not found");
      }

      const userBookings = data.bookings.filter(
        (b) => b.user_id === parseInt(userId)
      );

      const stats = {
        total_bookings: userBookings.length,
        completed_bookings: userBookings.filter((b) => b.status === "completed")
          .length,
        cancelled_bookings: userBookings.filter((b) => b.status === "cancelled")
          .length,
        pending_bookings: userBookings.filter((b) => b.status === "pending")
          .length,
        confirmed_bookings: userBookings.filter((b) => b.status === "confirmed")
          .length,
        total_spent: userBookings
          .filter((b) => b.status !== "cancelled")
          .reduce((total, booking) => {
            const product = data.products.find(
              (p) => p.id === booking.product_id
            );
            if (product) {
              const startDate = new Date(booking.start_date);
              const endDate = new Date(booking.end_date);
              const days = Math.floor(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
              );
              return total + product.price * days;
            }
            return total;
          }, 0),
      };

      const recentBookings = userBookings
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))
        .slice(0, 5)
        .map((booking) => {
          const product = data.products.find(
            (p) => p.id === booking.product_id
          );
          return {
            ...booking,
            product_name: product ? product.name : "Unknown Product",
          };
        });

      const { password, ...userWithoutPassword } = user;

      return {
        stats: { ...userWithoutPassword, ...stats },
        bookings: recentBookings,
      };
    },

    updateStatus: async (userId, newStatus) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userIndex = data.users.findIndex((u) => u.id === parseInt(userId));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser = {
        ...data.users[userIndex],
        status: newStatus,
      };

      console.log(`Admin - Updated user ${userId} status to ${newStatus}`);
      return updatedUser;
    },

    getUserWithStatusConfirmation: async (userId, newStatus) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const user = data.users.find((u) => u.id === parseInt(userId));
      if (!user) {
        throw new Error("User not found");
      }

      let confirmationType = "info";
      let icon = "user-edit";
      let title = `Update User Status`;
      let message = `Are you sure you want to change ${user.full_name}'s status to ${newStatus}?`;

      if (newStatus === "banned") {
        confirmationType = "danger";
        icon = "user-slash";
        title = "Ban User";
        message = `Are you sure you want to ban ${user.full_name}'s account? This will prevent them from logging in and making bookings.`;
      } else if (newStatus === "suspended") {
        confirmationType = "warning";
        icon = "user-clock";
        title = "Suspend User";
        message = `Are you sure you want to suspend ${user.full_name}'s account? They will not be able to make new bookings until reinstated.`;
      } else if (newStatus === "active") {
        confirmationType = "success";
        icon = "user-check";
        title = "Activate User";
        message = `Are you sure you want to activate ${user.full_name}'s account? They will have full access to the platform.`;
      }

      return {
        user,
        confirmationDetails: {
          title,
          message,
          type: confirmationType,
          icon,
        },
      };
    },

    getUserActivity: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const user = data.users.find((u) => u.id === parseInt(userId));
      if (!user) {
        throw new Error("User not found");
      }

      const today = new Date();
      const loginHistory = Array.from({ length: 10 }, (_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - Math.floor(Math.random() * 30));
        date.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60)
        );

        return {
          timestamp: date.toISOString(),
          activity:
            i % 3 === 0
              ? "Login"
              : i % 3 === 1
              ? "Booking Created"
              : "Profile Updated",
          ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
            Math.random() * 255
          )}`,
        };
      }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return {
        user_id: userId,
        activity: loginHistory,
      };
    },
  },

  analytics: {
    getBookingsByCategory: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const categories = {};

      data.bookings.forEach((booking) => {
        const product = data.products.find((p) => p.id === booking.product_id);
        if (product) {
          const category = product.category;
          if (!categories[category]) {
            categories[category] = {
              count: 0,
              revenue: 0,
            };
          }

          categories[category].count++;

          if (booking.status !== "cancelled") {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const days = Math.floor(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            categories[category].revenue += product.price * days;
          }
        }
      });

      return Object.entries(categories).map(([category, data]) => ({
        category,
        bookings_count: data.count,
        revenue: data.revenue,
      }));
    },

    getPopularProducts: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const productBookings = {};

      data.bookings.forEach((booking) => {
        const productId = booking.product_id;
        if (!productBookings[productId]) {
          productBookings[productId] = {
            count: 0,
            revenue: 0,
          };
        }

        productBookings[productId].count++;

        if (booking.status !== "cancelled") {
          const product = data.products.find((p) => p.id === productId);
          if (product) {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);
            const days = Math.floor(
              (endDate - startDate) / (1000 * 60 * 60 * 24)
            );
            productBookings[productId].revenue += product.price * days;
          }
        }
      });

      const popularProducts = Object.entries(productBookings)
        .map(([productId, stats]) => {
          const product = data.products.find(
            (p) => p.id === parseInt(productId)
          );
          return {
            product_id: parseInt(productId),
            product_name: product ? product.name : "Unknown Product",
            product_category: product ? product.category : "Unknown",
            bookings_count: stats.count,
            revenue: stats.revenue,
          };
        })
        .sort((a, b) => b.bookings_count - a.bookings_count)
        .slice(0, 10);

      return popularProducts;
    },

    exportReports: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const exportData = {
        products: data.products || 0,
        bookings: data.bookings || 0,
        users: data.users || 0,
        exported_at: new Date().toISOString(),
        report_type: "summary",
        generated_by: "admin",
      };

      console.log("Generating report:", exportData);

      return exportData;
    },
  },

  notifications: {
    createNotification: (message, type = "info") => {
      return {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString(),
      };
    },

    getNotificationStyles: (type) => {
      const styles = {
        success: "bg-green-100 border-l-4 border-green-500 text-green-700",
        error: "bg-red-100 border-l-4 border-red-500 text-red-700",
        warning: "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700",
        info: "bg-blue-100 border-l-4 border-blue-500 text-blue-700",
      };
      return styles[type] || styles.info;
    },

    markAsRead: async (notificationId) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log(`Notification ${notificationId} marked as read`);
      return { success: true, message: "Notification marked as read" };
    },

    deleteNotification: async (notificationId) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      console.log(`Notification ${notificationId} deleted`);
      return { success: true, message: "Notification deleted" };
    },
  },

  modals: {
    handleCloseAll: () => {
      return {
        productModal: false,
        bookingModal: false,
        userModal: false,
        deleteProductModal: false,
      };
    },

    handleOpen: (modalName) => {
      const result = {
        productModal: false,
        bookingModal: false,
        userModal: false,
        deleteProductModal: false,
        confirmationModal: false,
        exportModal: false,
      };

      result[modalName] = true;
      return result;
    },

    isOpen: (currentModals, modalName) => {
      return currentModals && currentModals[modalName] === true;
    },

    getConfig: (modalType, data = {}) => {
      const configs = {
        product: {
          title: data.id ? "Edit Product" : "Add New Product",
          size: "lg",
          submitLabel: data.id ? "Update Product" : "Add Product",
          closeLabel: "Cancel",
        },
        booking: {
          title: `Booking Details: #${data.id || ""}`,
          size: "lg",
          submitLabel: "Update Status",
          closeLabel: "Close",
        },
        user: {
          title: `User Profile: ${data.full_name || ""}`,
          size: "lg",
          submitLabel: "Update User",
          closeLabel: "Close",
        },
        confirmation: {
          title: data.title || "Confirm Action",
          size: "sm",
          submitLabel: data.confirmText || "Confirm",
          closeLabel: data.cancelText || "Cancel",
        },
        export: {
          title: "Export Data",
          size: "md",
          submitLabel: "Export",
          closeLabel: "Cancel",
        },
      };

      return (
        configs[modalType] || {
          title: "Modal",
          size: "md",
          submitLabel: "Submit",
          closeLabel: "Close",
        }
      );
    },
  },

  utils: {
    downloadJsonFile: (data, filename = "export.json") => {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", filename);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      return true;
    },

    calculateRentalDays: (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    },

    calculateBookingTotal: (product, startDate, endDate) => {
      if (!product) return 0;
      const days = AdminApiService.utils.calculateRentalDays(
        startDate,
        endDate
      );
      return product.price * days;
    },

    getTabsConfig: () => {
      return [
        "tab-dashboard",
        "tab-products",
        "tab-bookings",
        "tab-users",
        "tab-settings",
      ];
    },

    validateHash: (hash) => {
      const validTabs = AdminApiService.utils.getTabsConfig();
      return validTabs.includes(hash) ? hash : "tab-dashboard";
    },

    getConfirmationDetails: (type, data) => {
      const confirmations = {
        deleteProduct: {
          title: `Delete ${data?.name || "Product"}`,
          message: `Are you sure you want to delete ${
            data?.name || "this product"
          }? This action cannot be undone.`,
          type: "danger",
          icon: "trash-alt",
          confirmText: "Delete",
          cancelText: "Cancel",
        },
        updateBookingStatus: {
          title: `Update Booking Status`,
          message: `Are you sure you want to change the status to ${
            data?.status || "the new status"
          }?`,
          type:
            data?.status === "cancelled"
              ? "danger"
              : data?.status === "completed"
              ? "success"
              : "info",
          icon:
            data?.status === "cancelled"
              ? "calendar-times"
              : data?.status === "completed"
              ? "calendar-check"
              : "calendar-alt",
          confirmText: "Update",
          cancelText: "Cancel",
        },
        changeUserStatus: {
          title: `Change User Status`,
          message: `Are you sure you want to change this user's status to ${
            data?.status || "the new status"
          }?`,
          type:
            data?.status === "banned"
              ? "danger"
              : data?.status === "suspended"
              ? "warning"
              : "success",
          icon:
            data?.status === "banned"
              ? "user-slash"
              : data?.status === "suspended"
              ? "user-clock"
              : "user-check",
          confirmText: "Confirm",
          cancelText: "Cancel",
        },
        default: {
          title: "Confirm Action",
          message: "Are you sure you want to perform this action?",
          type: "warning",
          icon: "exclamation-triangle",
          confirmText: "Confirm",
          cancelText: "Cancel",
        },
      };

      return confirmations[type] || confirmations.default;
    },
  },

  errorHandler: (error, customMessage = "An error occurred") => {
    console.error(customMessage, error);
    return {
      success: false,
      message: error.message || customMessage,
      error: error,
    };
  },
};

export default AdminApiService;
