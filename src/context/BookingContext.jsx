import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/ApiService";
import { useAuth } from "./AuthContext";
import { useProducts } from "./ProductContext";

const BookingContext = createContext();

export const useBookings = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { products, getProduct } = useProducts();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await ApiService.bookings.getAll();
        setBookings(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getUserBookings = () => {
    if (!user || !bookings.length) return [];

    return bookings
      .filter((booking) => booking.user_id === user.id)
      .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
  };

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      const newBooking = await ApiService.bookings.create(bookingData);
      setBookings([...bookings, newBooking]);
      return newBooking;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      setLoading(true);

      const booking = bookings.find((b) => b.id === parseInt(bookingId));
      if (!booking) {
        throw new Error("Booking not found");
      }

      const product = getProduct(booking.product_id);
      if (!product) {
        throw new Error("Product not found");
      }

      const updatedBooking = {
        ...booking,
        status: "confirmed",
      };

      console.log("Confirming booking:", updatedBooking);

      setBookings((prevBookings) =>
        prevBookings.map((b) =>
          b.id === parseInt(bookingId) ? updatedBooking : b
        )
      );

      return {
        booking: updatedBooking,
        productName: product.name,
        userId: booking.user_id,
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    bookings,
    loading,
    error,
    getUserBookings,
    createBooking,
    confirmBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
