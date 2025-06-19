import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/ApiService";

const ReviewContext = createContext();

export const useReviews = () => {
  return useContext(ReviewContext);
};

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        try {
          const reviewsData = await ApiService.reviews.getAll();
          setReviews(reviewsData);
        } catch (reviewErr) {
          console.error("Error fetching reviews:", reviewErr);
          setReviews([]);
        }
        try {
          const usersData = await ApiService.users.getAll();
          setUsers(usersData);
        } catch (userErr) {
          console.error("Error fetching users:", userErr);
          setUsers([]);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error in fetchData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductReviews = (productId) => {
    if (!reviews || reviews.length === 0) return [];

    try {
      const productReviews = reviews
        .filter((review) => review.product_id === parseInt(productId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return productReviews.map((review) => {
        const user = users.find((u) => u.id === review.user_id);
        return {
          ...review,
          user_name: user ? user.full_name : "Unknown User",
        };
      });
    } catch (error) {
      console.error("Error in getProductReviews:", error);
      return [];
    }
  };

  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      const newReview = await ApiService.reviews.create({
        user_id: reviewData.userId,
        product_id: reviewData.productId,
        booking_id: reviewData.bookingId,
        rating: reviewData.rating,
        comment: reviewData.reviewText,
      });

      setReviews((prevReviews) => [...prevReviews, newReview]);
      return newReview;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hasUserReviewedProduct = (userId, productId, bookingId) => {
    if (!reviews || reviews.length === 0) return false;

    return reviews.some(
      (review) =>
        review.user_id === userId &&
        review.product_id === productId &&
        (bookingId ? review.booking_id === bookingId : true)
    );
  };

  const value = {
    reviews,
    loading,
    error,
    getProductReviews,
    createReview,
    hasUserReviewedProduct,
  };

  return (
    <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>
  );
};

export default ReviewContext;
