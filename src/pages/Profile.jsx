import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingContext";
import { useProducts } from "../context/ProductContext";
import { useReviews } from "../context/ReviewContext";
import ProfileForm from "../components/profile/ProfileForm";
import UserBookings from "../components/profile/UserBookings";
import AlertMessage from "../components/profile/AlertMessage";
import { Link } from "react-router-dom";

const Profile = () => {
  const [userBookings, setUserBookings] = useState([]);
  const [message, setMessage] = useState(null);
  const { user, setUser } = useAuth();
  const { getUserBookings, cancelBooking } = useBookings();
  const { products } = useProducts();
  const { createReview, hasUserReviewedProduct } = useReviews();

  useEffect(() => {
    if (!user) {
      setUserBookings([]);
      return;
    }
    const rawBookings = getUserBookings();
    const enrichedBookings = rawBookings.map((booking) => {
      const product = products.find((p) => p.id === booking.product_id);
      return {
        ...booking,
        product_name: product?.name || "Unknown Product",
        product_image: product?.image || "",
        product_price: product?.price || 0,
        has_review: hasUserReviewedProduct(
          user.id,
          booking.product_id,
          booking.id
        ),
      };
    });
    setUserBookings(enrichedBookings);
  }, [user, products, getUserBookings, hasUserReviewedProduct]);

  const handleProfileUpdate = (formData) => {
    setUser({
      ...user,
      ...formData,
    });
    setMessage({
      type: "success",
      text: "Profile updated successfully",
    });

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);

      const updatedBookings = userBookings.map((booking) => {
        if (booking.id === bookingId) {
          return { ...booking, status: "cancelled" };
        }
        return booking;
      });
      setUserBookings(updatedBookings);

      setMessage({
        type: "success",
        text: "Booking cancelled successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to cancel booking: ${error.message}`,
      });
    } finally {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      await createReview({
        userId: user.id,
        productId: reviewData.productId,
        bookingId: reviewData.bookingId,
        rating: reviewData.rating,
        reviewText: reviewData.reviewText,
      });

      const updatedBookings = userBookings.map((booking) => {
        if (booking.id === reviewData.bookingId) {
          return { ...booking, has_review: true };
        }
        return booking;
      });
      setUserBookings(updatedBookings);

      setMessage({
        type: "success",
        text: "Review submitted successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: `Failed to submit review: ${error.message}`,
      });
    } finally {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  if (!user) {
    return (
      <main className="py-14 bg-[#fafafa] min-h-screen">
        <div className="page-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
              My Account
              <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
            </h2>
          </div>

          <div className="text-center py-16 bg-white rounded-xl shadow-sm mx-auto max-w-lg">
            <div className="animate-bounce mb-4">
              <i className="fas fa-user-lock text-gray-400 text-5xl mb-3"></i>
            </div>
            <p className="text-gray-600 mb-4">
              Please log in to access your profile.
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
    <main className="py-14 bg-[#fafafa] min-h-screen">
      <div className="page-container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            My Account
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Manage your profile information and view your rental history
          </p>
          {user && user.role === "admin" && (
            <div className="mt-4">
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                <i className="fas fa-user-shield mr-2"></i>
                Access Admin Panel
              </Link>
            </div>
          )}
        </div>

        {message && <AlertMessage type={message.type} message={message.text} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <ProfileForm user={user} onSubmit={handleProfileUpdate} />
          </div>

          <div className="lg:col-span-2">
            <UserBookings
              bookings={userBookings}
              onCancelBooking={handleCancelBooking}
              onSubmitReview={handleSubmitReview}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
