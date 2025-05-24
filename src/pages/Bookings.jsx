import React, { useState, useEffect } from "react";
import BookingsCard from "../components/bookings/BookingsCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/apiService";

const Bookings = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/bookings" } });
      return;
    }

    if (!user) {
      setUserBookings([]);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const bookings = await ApiService.bookings.getByUserId(user.id);

        const products = await ApiService.products.getAll();

        const enrichedBookings = bookings.map((booking) => {
          const product = products.find((p) => p.id === booking.product_id);
          return {
            ...booking,
            productName: product?.name || "Unknown Product",
            productImage: product?.image || "",
            productPrice: product?.price || 0, // Add this line to include price
          };
        });

        setUserBookings(enrichedBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, isAuthenticated, navigate]);

  if (!user) {
    return (
      <main className="py-14 bg-[#fafafa]">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
              My Bookings
              <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
            </h2>
          </div>

          <div className="text-center py-16 bg-white rounded-xl shadow-sm mx-auto max-w-lg">
            <div className="animate-bounce mb-4">
              <i className="fas fa-user-lock text-gray-400 text-5xl mb-3"></i>
            </div>
            <p className="text-gray-600 mb-4">
              Please log in to view your bookings.
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Log In
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-14 bg-[#fafafa]">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            My Bookings
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            View and manage all your equipment rentals in one place
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm mx-auto max-w-lg">
            <div className="mb-4 text-red-500">
              <i className="fas fa-exclamation-circle text-5xl"></i>
            </div>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-sync-alt mr-2"></i> Try Again
            </button>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm mx-auto max-w-lg">
            <div className="animate-bounce mb-4">
              <i className="fas fa-calendar-times text-gray-400 text-5xl mb-3"></i>
            </div>
            <p className="text-gray-600 mb-4">
              You don't have any bookings yet.
            </p>
            <a
              href="/browse"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              <i className="fas fa-search mr-2"></i> Browse Equipment
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {userBookings.map((booking) => (
              <BookingsCard
                key={booking.id}
                booking={booking}
                product={{
                  id: booking.product_id,
                  name: booking.productName,
                  image: booking.productImage,
                  price: booking.productPrice || booking.product_price || 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Bookings;
