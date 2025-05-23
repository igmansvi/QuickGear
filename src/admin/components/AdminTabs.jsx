import React from "react";

const AdminTabs = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm mb-6">
      <div className="container mx-auto">
        <div className="flex gap-4 p-4">
          <button
            onClick={() => onTabChange("tab-dashboard")}
            className={`tab-btn ${
              activeTab === "tab-dashboard" ? "active" : ""
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange("tab-products")}
            className={`tab-btn ${
              activeTab === "tab-products" ? "active" : ""
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onTabChange("tab-bookings")}
            className={`tab-btn ${
              activeTab === "tab-bookings" ? "active" : ""
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => onTabChange("tab-users")}
            className={`tab-btn ${activeTab === "tab-users" ? "active" : ""}`}
          >
            Users
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .tab-btn {
          padding: 0.5rem 1rem;
          color: #4b5563;
          border-radius: 0.5rem;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #1f2937;
          background-color: #f3f4f6;
        }

        .tab-btn.active {
          background-color: #3b82f6;
          color: white;
        }

        .tab-btn.active:hover {
          background-color: #2563eb;
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default AdminTabs;
