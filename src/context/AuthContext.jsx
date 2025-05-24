import React, { createContext, useContext, useState, useEffect } from "react";
import ApiService from "../services/apiService";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const SESSION_DURATION = 12 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const checkSessionExpiry = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData.loginTimestamp) {
      const currentTime = new Date().getTime();
      if (currentTime - userData.loginTimestamp > SESSION_DURATION) {
        localStorage.removeItem("user");
        return null;
      }
      return userData;
    }
    return null;
  };

  useEffect(() => {
    const validUser = checkSessionExpiry();
    if (validUser) {
      setUser(validUser);
      fetchUnreadNotificationsCount(validUser.id);
    }
    setLoading(false);
  }, []);

  const fetchUnreadNotificationsCount = async (userId) => {
    try {
      const count = await ApiService.notifications.getUnreadCount(userId);
      setUnreadNotifications(count);
    } catch (err) {
      console.error("Error fetching notification count:", err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const foundUser = await ApiService.users.login(email, password);
      const userWithTimestamp = {
        ...foundUser,
        loginTimestamp: new Date().getTime(),
      };
      setUser(userWithTimestamp);
      localStorage.setItem("user", JSON.stringify(userWithTimestamp));

      fetchUnreadNotificationsCount(foundUser.id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const newUser = await ApiService.users.register(userData);
      const userWithTimestamp = {
        ...newUser,
        loginTimestamp: new Date().getTime(),
      };
      setUser(userWithTimestamp);
      localStorage.setItem("user", JSON.stringify(userWithTimestamp));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUnreadNotifications(0);
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const refreshNotificationCount = () => {
    if (user) {
      fetchUnreadNotificationsCount(user.id);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    unreadNotifications,
    refreshNotificationCount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
