import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminHeader = ({ username }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Quick Gear
            </Link>
            <span className="ml-4 text-gray-500">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
