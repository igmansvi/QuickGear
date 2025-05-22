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
      return newBooking;
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
};

export default ApiService;
