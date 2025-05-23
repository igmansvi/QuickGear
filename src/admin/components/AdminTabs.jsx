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
    <nav className="bg-white shadow-sm mb-6 overflow-x-auto sticky top-16 z-30">
      <div className="container mx-auto">
        <div className="flex p-4 gap-2 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab-btn whitespace-nowrap ${
                activeTab === tab.id ? "active" : ""
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <style jsx="true">{`
        .tab-btn {
          padding: 0.5rem 1rem;
          color: #4b5563;
          border-radius: 0.5rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
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
