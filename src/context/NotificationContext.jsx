import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/apiService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const { user, refreshNotificationCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user && isModalOpen) {
      fetchUserNotifications();
    }
  }, [user, isModalOpen]);

  const fetchUserNotifications = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userNotifications = await ApiService.notifications.getByUserId(
        user.id
      );
      userNotifications.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(userNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await ApiService.notifications.markAsRead(notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      refreshNotificationCount();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      const promises = notifications
        .filter((notification) => !notification.is_read)
        .map((notification) =>
          ApiService.notifications.markAsRead(notification.id)
        );

      await Promise.all(promises);

      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      refreshNotificationCount();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const value = {
    notifications,
    loading,
    error,
    isModalOpen,
    openModal,
    closeModal,
    markAsRead,
    markAllAsRead,
    fetchUserNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
