import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/apiService";
import { useAuth } from "./AuthContext";

const BookingContext = createContext();

export const useBookings = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

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

  const value = {
    bookings,
    loading,
    error,
    getUserBookings,
    createBooking,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
