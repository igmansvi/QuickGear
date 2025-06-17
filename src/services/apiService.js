import localStorageDB from "../staticDB/LocalStorageDB";

/**
 * A service to handle API calls
 * Using LocalStorageDB for data persistence
 */
const ApiService = {
  products: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return localStorageDB.getCollection("products");
    },

    getById: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const product = localStorageDB.getItem("products", id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },

    create: async (productData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newProduct = {
        ...productData,
        created_at: localStorageDB.getTimestamp(),
      };

      const savedProduct = localStorageDB.addItem("products", newProduct);
      console.log("Creating new product:", savedProduct);
      return savedProduct;
    },

    getForRental: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const product = localStorageDB.getItem("products", id);
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
      return localStorageDB.getCollection("bookings");
    },

    getByUserId: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return localStorageDB.filterCollection(
        "bookings",
        (booking) => booking.user_id === parseInt(userId)
      );
    },

    create: async (bookingData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newBooking = {
        ...bookingData,
        booking_date: localStorageDB.getTimestamp(),
        status: "pending",
      };

      const savedBooking = localStorageDB.addItem("bookings", newBooking);
      console.log("Creating new booking:", savedBooking);

      // Create notification for the new booking
      const product = localStorageDB.getItem(
        "products",
        savedBooking.product_id
      );
      await ApiService.notifications.create({
        user_id: savedBooking.user_id,
        booking_id: savedBooking.id,
        message: `Your booking for ${product?.name} is pending payment. Please complete payment to confirm your booking.`,
        type: "payment_reminder",
      });

      return savedBooking;
    },

    updateStatus: async (bookingId, newStatus, paymentCompleted = false) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const booking = localStorageDB.getItem("bookings", bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }

      const oldStatus = booking.status;
      const updatedBooking = localStorageDB.updateItem("bookings", bookingId, {
        status: newStatus,
        updated_at: localStorageDB.getTimestamp(),
      });

      const product = localStorageDB.getItem("products", booking.product_id);

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

      return updatedBooking;
    },

    getById: async (bookingId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const booking = localStorageDB.getItem("bookings", bookingId);
      if (!booking) {
        throw new Error("Booking not found");
      }
      return booking;
    },
  },

  users: {
    login: async (email, password) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = localStorageDB.getCollection("users");
      const user = users.find(
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

      const users = localStorageDB.getCollection("users");
      const existingUser = users.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error("Email already in use");
      }

      const newUserData = {
        ...userData,
        created_at: localStorageDB.getTimestamp(),
        updated_at: localStorageDB.getTimestamp(),
        role: "user",
      };

      const savedUser = localStorageDB.addItem("users", newUserData);
      console.log("Registering new user:", savedUser);

      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    },

    getProfile: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const user = localStorageDB.getItem("users", userId);
      if (!user) {
        throw new Error("User not found");
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    updateProfile: async (userId, userData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const { role, ...updateData } = userData;
      updateData.updated_at = localStorageDB.getTimestamp();

      const updatedUser = localStorageDB.updateItem(
        "users",
        userId,
        updateData
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }

      console.log("Updating user:", updatedUser);

      const { password: _, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    },

    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return localStorageDB.getCollection("users");
    },
  },

  reviews: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return localStorageDB.getCollection("reviews");
    },

    getByProductId: async (productId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return localStorageDB.filterCollection(
        "reviews",
        (review) => review.product_id === parseInt(productId)
      );
    },

    create: async (reviewData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReview = {
        ...reviewData,
        created_at: localStorageDB.getTimestamp(),
      };

      const savedReview = localStorageDB.addItem("reviews", newReview);
      console.log("Creating new review:", savedReview);

      // Create acknowledgment notification
      await ApiService.notifications.create({
        user_id: reviewData.user_id,
        booking_id: reviewData.booking_id,
        message: `Thank you for your review. Your feedback helps other users!`,
        type: "review_acknowledgement",
      });

      return savedReview;
    },
  },

  notifications: {
    getAll: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return localStorageDB.getCollection("notifications");
    },

    getByUserId: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return localStorageDB.filterCollection(
        "notifications",
        (notification) => notification.user_id === parseInt(userId)
      );
    },

    markAsRead: async (notificationId) => {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedNotification = localStorageDB.updateItem(
        "notifications",
        notificationId,
        {
          is_read: true,
        }
      );

      if (!updatedNotification) {
        throw new Error("Notification not found");
      }

      return updatedNotification;
    },

    create: async (notificationData) => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newNotification = {
        ...notificationData,
        is_read: false,
        created_at: localStorageDB.getTimestamp(),
      };

      const savedNotification = localStorageDB.addItem(
        "notifications",
        newNotification
      );
      console.log("Creating new notification:", savedNotification);
      return savedNotification;
    },

    getUnreadCount: async (userId) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const unreadNotifications = localStorageDB.filterCollection(
        "notifications",
        (notification) =>
          notification.user_id === parseInt(userId) && !notification.is_read
      );
      return unreadNotifications.length;
    },
  },
};

export default ApiService;
