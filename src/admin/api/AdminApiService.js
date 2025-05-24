import data from "../../staticDB/data.json";

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

      return { success: true, message: "Product deleted successfully" };
    },
  },

  bookings: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.bookings];
    },

    updateStatus: async (bookingId, status) => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const bookingIndex = data.bookings.findIndex(
          (b) => b.id === parseInt(bookingId)
        );
        if (bookingIndex === -1) {
          throw new Error("Booking not found");
        }

        const validStatuses = [
          "pending",
          "confirmed",
          "completed",
          "cancelled",
        ];
        if (!validStatuses.includes(status)) {
          throw new Error(`Invalid booking status: ${status}`);
        }

        const updatedBooking = {
          ...data.bookings[bookingIndex],
          status,
          updated_at: new Date().toISOString(),
        };

        return updatedBooking;
      } catch (error) {
        return AdminApiService.errorHandler(
          error,
          "Error updating booking status"
        );
      }
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

      return updatedUser;
    },
  },

  analytics: {
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

      return exportData;
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

    downloadCsvFile: (data, filename = "export.csv") => {
      const headers = Object.keys(data[0] || {}).join(",");
      const csvRows = data.map((row) =>
        Object.values(row)
          .map((value) =>
            typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
          )
          .join(",")
      );

      const csvString = [headers, ...csvRows].join("\n");
      const csvData =
        "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);

      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", csvData);
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
