import data from "../api/staticDB/data.json";

/**
 * A service to handle API calls
 * Currently using static data but structured to easily switch to MongoDB later
 */
const ApiService = {
  products: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.products];
    },

    getById: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const product = data.products.find((p) => p.id === parseInt(id));
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },

    create: async (productData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newProduct = {
        id: data.products.length + 1,
        ...productData,
        created_at: new Date().toISOString(),
      };

      console.log("Creating new product:", newProduct);
      return newProduct;
    },

    getForRental: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const product = data.products.find((p) => p.id === parseInt(id));
      if (!product) {
        throw new Error("Product not found");
      }

      return {
        ...product,
        availabilityStatus: "Available",
      };
    },
  },

  bookings: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.bookings];
    },

    getByUserId: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data.bookings.filter(
        (booking) => booking.user_id === parseInt(userId)
      );
    },

    create: async (bookingData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newBooking = {
        id: data.bookings.length + 1,
        ...bookingData,
        booking_date: new Date().toISOString().replace("T", " ").split(".")[0],
        status: "pending",
      };

      console.log("Creating new booking:", newBooking);

      await ApiService.notifications.create({
        user_id: newBooking.user_id,
        booking_id: newBooking.id,
        message: `Your booking for ${
          data.products.find((p) => p.id === newBooking.product_id)?.name
        } is pending payment. Please complete payment to confirm your booking.`,
        type: "payment_reminder",
      });

      return newBooking;
    },

    updateStatus: async (bookingId, newStatus, paymentCompleted = false) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const booking = data.bookings.find((b) => b.id === parseInt(bookingId));
      if (!booking) {
        throw new Error("Booking not found");
      }

      const oldStatus = booking.status;
      booking.status = newStatus;

      const product = data.products.find((p) => p.id === booking.product_id);

      if (
        oldStatus === "pending" &&
        newStatus === "confirmed" &&
        paymentCompleted
      ) {
        await ApiService.notifications.create({
          user_id: booking.user_id,
          booking_id: booking.id,
          message: `Your booking for ${product?.name} has been confirmed after successful payment.`,
          type: "booking_confirmed",
        });
      } else if (newStatus === "cancelled") {
        await ApiService.notifications.create({
          user_id: booking.user_id,
          booking_id: booking.id,
          message: `Your booking for ${product?.name} has been cancelled. Refund will be processed within 3-5 business days.`,
          type: "booking_cancelled",
        });
      } else if (newStatus === "completed") {
        await ApiService.notifications.create({
          user_id: booking.user_id,
          booking_id: booking.id,
          message: `Your booking for ${product?.name} has been completed. We hope you enjoyed using our product!`,
          type: "booking_completed",
        });

        setTimeout(async () => {
          await ApiService.notifications.create({
            user_id: booking.user_id,
            booking_id: booking.id,
            message: `How was your experience with the ${product?.name}? Please leave a review.`,
            type: "review_request",
          });
        }, 1000);
      }

      return booking;
    },

    getById: async (bookingId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const booking = data.bookings.find((b) => b.id === parseInt(bookingId));
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    },
  },

  users: {
    login: async (email, password) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = data.users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    register: async (userData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const existingUser = data.users.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const newUser = {
        id: data.users.length + 1,
        ...userData,
        created_at: new Date().toISOString(),
      };

      console.log("Registering new user:", newUser);

      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    },

    getProfile: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const user = data.users.find((u) => u.id === parseInt(userId));
      if (!user) {
        throw new Error("User not found");
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    updateProfile: async (userId, userData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const userIndex = data.users.findIndex((u) => u.id === parseInt(userId));
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser = {
        ...data.users[userIndex],
        ...userData,
        id: parseInt(userId),
      };

      console.log("Updating user:", updatedUser);

      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    },

    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.users];
    },
  },

  reviews: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.reviews];
    },

    getByProductId: async (productId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data.reviews.filter(
        (review) => review.product_id === parseInt(productId)
      );
    },

    create: async (reviewData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReview = {
        id: data.reviews.length + 1,
        ...reviewData,
        created_at: new Date().toISOString(),
      };

      console.log("Creating new review:", newReview);
      return newReview;
    },
  },

  notifications: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [...data.notifications];
    },

    getByUserId: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return data.notifications.filter(
        (notification) => notification.user_id === parseInt(userId)
      );
    },

    markAsRead: async (notificationId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const notification = data.notifications.find(
        (n) => n.id === parseInt(notificationId)
      );

      if (!notification) {
        throw new Error("Notification not found");
      }

      notification.is_read = true;
      return notification;
    },

    create: async (notificationData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newNotification = {
        id: data.notifications.length + 1,
        ...notificationData,
        is_read: false,
        created_at: new Date().toISOString().replace("T", " ").split(".")[0],
      };

      console.log("Creating new notification:", newNotification);
      return newNotification;
    },

    getUnreadCount: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const userNotifications = data.notifications.filter(
        (notification) =>
          notification.user_id === parseInt(userId) && !notification.is_read
      );
      return userNotifications.length;
    },
  },
};

export default ApiService;
