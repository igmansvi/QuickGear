import React from "react";

const AdminTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "tab-dashboard", label: "Dashboard", icon: "fa-chart-line" },
    { id: "tab-products", label: "Products", icon: "fa-box" },
    { id: "tab-bookings", label: "Bookings", icon: "fa-calendar-check" },
    { id: "tab-users", label: "Users", icon: "fa-users" },
    { id: "tab-settings", label: "Settings", icon: "fa-cog" },
  ];

  return (
    <nav className="bg-gradient-to-r from-gray-50 to-white shadow-md mb-6 overflow-x-auto sticky top-16 z-30">
      <div className="container mx-auto">
        <div className="flex p-3 gap-1 md:gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .tab-btn {
          padding: 0.625rem 1.25rem;
          color: #4b5563;
          border-radius: 0.5rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          font-weight: 500;
          font-size: 0.95rem;
          overflow: hidden;
        }

        .tab-btn:hover {
          color: #1f2937;
          background-color: #f3f4f6;
        }

        .tab-btn.active {
          background-image: linear-gradient(to right, #3b82f6, #4f46e5);
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .tab-btn.active:hover {
          background-image: linear-gradient(to right, #2563eb, #4338ca);
          transform: translateY(-1px);
        }

        .tab-btn:active {
          transform: translateY(1px);
        }

        @media (max-width: 640px) {
          .tab-btn {
            padding: 0.5rem 0.75rem;
          }

          .tab-btn span {
            display: none;
          }

          .tab-btn i {
            font-size: 1.25rem;
            margin: 0;
          }
        }
      `}</style>
    </nav>
  );
};

export default AdminTabs;
