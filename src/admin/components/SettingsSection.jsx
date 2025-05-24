import React, { useState } from "react";

const SettingsSection = ({ adminUser, onNotification }) => {
  const [activeSection, setActiveSection] = useState("general");
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "QuickGear",
    siteDescription: "Rental platform for equipment and gear",
    supportEmail: "support@quickgear.com",
    contactPhone: "+91 12345 67890",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    bookingAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
  });

  const handleGeneralSettingsSave = (e) => {
    e.preventDefault();
    onNotification("General settings updated successfully", "success");
  };

  const handleNotificationSettingsSave = (e) => {
    e.preventDefault();
    onNotification("Notification preferences updated successfully", "success");
  };

  const handleToggleChange = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sidebar */}
        <div className="bg-gray-50 p-6 rounded-tl-xl rounded-bl-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection("general")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeSection === "general"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              <i className="fas fa-cog mr-2"></i> General
            </button>
            <button
              onClick={() => setActiveSection("notifications")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeSection === "notifications"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              <i className="fas fa-bell mr-2"></i> Notifications
            </button>
            <button
              onClick={() => setActiveSection("security")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeSection === "security"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              <i className="fas fa-lock mr-2"></i> Security
            </button>
            <button
              onClick={() => setActiveSection("about")}
              className={`w-full text-left px-4 py-2 rounded-lg transition ${
                activeSection === "about"
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              <i className="fas fa-info-circle mr-2"></i> About System
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="p-6 col-span-3">
          {activeSection === "general" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">General Settings</h3>
              <form onSubmit={handleGeneralSettingsSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteName: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          supportEmail: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={generalSettings.contactPhone}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={generalSettings.siteDescription}
                      onChange={(e) =>
                        setGeneralSettings({
                          ...generalSettings,
                          siteDescription: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 resize-none"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Notification Preferences
              </h3>
              <form onSubmit={handleNotificationSettingsSave}>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive email notifications for important system events
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.emailNotifications}
                        onChange={() =>
                          handleToggleChange("emailNotifications")
                        }
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Booking Alerts
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get notified when new bookings are made
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.bookingAlerts}
                        onChange={() => handleToggleChange("bookingAlerts")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        System Updates
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get notified about system updates and maintenance
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.systemUpdates}
                        onChange={() => handleToggleChange("systemUpdates")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Marketing Emails
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive promotional emails about new features
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings.marketingEmails}
                        onChange={() => handleToggleChange("marketingEmails")}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Preferences
                </button>
              </form>
            </div>
          )}

          {activeSection === "security" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Security settings are managed through the central
                      authentication system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Change Password
                  </h4>
                  <button
                    onClick={() =>
                      onNotification(
                        "Password reset link sent to your email",
                        "info"
                      )
                    }
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Reset Password
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Two-Factor Authentication
                  </h4>
                  <button
                    onClick={() =>
                      onNotification(
                        "2FA setup would be implemented in a real system",
                        "info"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Enable 2FA
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    Session Management
                  </h4>
                  <button
                    onClick={() =>
                      onNotification(
                        "All other sessions have been logged out",
                        "success"
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Sign Out All Other Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "about" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                About QuickGear Admin System
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="flex justify-center mb-4">
                  <img
                    src="/logo.png"
                    alt="QuickGear Logo"
                    className="h-20 w-auto"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/200x80?text=QuickGear";
                    }}
                  />
                </div>
                <h4 className="text-lg font-medium text-center mb-2">
                  Version 1.0.0
                </h4>
                <p className="text-center text-gray-600 mb-4">
                  Build 2023.08.15
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Frontend:</strong> React with Tailwind CSS
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Backend:</strong> Node.js with Express
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Database:</strong> MongoDB
                  </p>
                  <p className="text-gray-700">
                    <strong>Authentication:</strong> JWT with role-based access
                    control
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                <p className="text-blue-700 mb-4">
                  If you're experiencing issues or have questions about the
                  admin system, please contact our support team.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() =>
                      onNotification(
                        "Documentation would open in a real system",
                        "info"
                      )
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <i className="fas fa-book mr-2"></i> Documentation
                  </button>
                  <button
                    onClick={() =>
                      onNotification(
                        "Support ticket system would open in a real system",
                        "info"
                      )
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <i className="fas fa-headset mr-2"></i> Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
