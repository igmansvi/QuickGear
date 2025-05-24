import React from "react";
import { useNotifications } from "../../context/NotificationContext";
import Modal from "./Modal";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

const formatDistanceToNow = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return "just now";
  } else if (diffMins < 60) {
    return diffMins === 1 ? "1 minute ago" : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "yesterday" : `${diffDays} days ago`;
  } else {
    return formatDate(dateString);
  }
};

const NotificationModal = () => {
  const {
    notifications,
    loading,
    error,
    isModalOpen,
    closeModal,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  if (!isModalOpen) return null;

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays > 2) {
      return formatDate(dateString);
    }

    return formatDistanceToNow(dateString);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking_confirmed":
        return <i className="fas fa-check-circle text-green-500 text-xl"></i>;
      case "booking_cancelled":
        return <i className="fas fa-times-circle text-red-500 text-xl"></i>;
      case "booking_completed":
        return <i className="fas fa-flag-checkered text-blue-500 text-xl"></i>;
      case "payment_reminder":
        return <i className="fas fa-credit-card text-yellow-500 text-xl"></i>;
      case "review_request":
        return <i className="fas fa-star text-purple-500 text-xl"></i>;
      case "review_acknowledgement":
        return <i className="fas fa-thumbs-up text-blue-500 text-xl"></i>;
      case "booking_reminder":
        return <i className="fas fa-bell text-orange-500 text-xl"></i>;
      default:
        return <i className="fas fa-bell text-blue-500 text-xl"></i>;
    }
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupKey;

    if (date.toDateString() === today.toDateString()) {
      groupKey = "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = "Yesterday";
    } else {
      groupKey = formatDate(notification.created_at);
    }

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push(notification);
    return groups;
  }, {});

  const getTypeColor = (type) => {
    switch (type) {
      case "booking_confirmed":
        return "bg-green-50 border-green-200";
      case "booking_cancelled":
        return "bg-red-50 border-red-200";
      case "booking_completed":
        return "bg-blue-50 border-blue-200";
      case "payment_reminder":
        return "bg-yellow-50 border-yellow-200";
      case "review_request":
        return "bg-purple-50 border-purple-200";
      case "review_acknowledgement":
        return "bg-indigo-50 border-indigo-200";
      case "booking_reminder":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Modal onClose={closeModal} size="md" showCloseButton={false}>
      <div className="flex flex-col max-h-[80vh] overflow-hidden border-0 rounded-lg">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center">
            <i className="fas fa-bell mr-3 text-xl"></i>
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.is_read) && (
              <button
                onClick={markAllAsRead}
                className="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-colors flex items-center shadow-sm"
                disabled={loading}
              >
                <i className="fas fa-check-double mr-1.5"></i>
                Mark all read
              </button>
            )}
            <button
              onClick={closeModal}
              className="bg-white/10 hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 bg-gray-50 scrollbar-hide">
          {loading && (
            <div className="flex flex-col justify-center items-center p-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <div className="bg-red-50 p-4 rounded-lg inline-block mb-2">
                <i className="fas fa-exclamation-circle text-red-500 text-2xl"></i>
              </div>
              <p className="text-red-600">{error}</p>
              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="p-12 text-center">
              <div className="bg-blue-50 p-6 rounded-full inline-block mb-4">
                <i className="far fa-bell-slash text-blue-500 text-4xl"></i>
              </div>
              <p className="text-gray-600 text-lg">No notifications yet</p>
              <p className="text-gray-500 mt-1">
                We'll notify you when something happens
              </p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="p-2">
              {Object.entries(groupedNotifications).map(
                ([date, dateNotifications]) => (
                  <div key={date} className="mb-4">
                    <div className="sticky top-0 bg-gray-100 py-2 px-4 text-sm font-medium text-gray-600 shadow-sm z-10">
                      {date}
                    </div>
                    <div className="space-y-2 mt-2">
                      {dateNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`mx-2 p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${getTypeColor(
                            notification.type
                          )} ${!notification.is_read ? "shadow-sm" : ""}`}
                          onClick={() =>
                            !notification.is_read && markAsRead(notification.id)
                          }
                        >
                          <div className="flex items-start">
                            <div className="mr-3 flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <p
                                  className={`${
                                    !notification.is_read
                                      ? "font-semibold"
                                      : "font-normal"
                                  } text-gray-800`}
                                >
                                  {notification.message}
                                </p>
                                {!notification.is_read && (
                                  <span className="ml-2 h-3 w-3 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-gray-500">
                                  {formatNotificationTime(
                                    notification.created_at
                                  )}
                                </p>
                                {!notification.is_read && (
                                  <button
                                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {!loading && !error && notifications.length > 0 && (
          <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              You have {notifications.filter((n) => !n.is_read).length} unread
              notification
              {notifications.filter((n) => !n.is_read).length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotificationModal;
