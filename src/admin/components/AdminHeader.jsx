import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminHeader = ({ username, onRefresh }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-[#2b2d42] to-[#4361ee] text-white shadow-xl sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <i className="fas fa-tools mr-3 text-3xl text-[#3a86ff] drop-shadow-md group-hover:scale-110 transition-transform duration-300"></i>
              <div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a8dadc]">
                  Quick Gear
                </span>
                <div className="flex items-center">
                  <span className="text-xs text-blue-200">Admin Panel</span>
                  <span className="ml-2 w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onRefresh}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              title="Refresh Data"
            >
              <i className="fas fa-sync-alt"></i>
            </button>

            <div
              className="hidden md:flex items-center bg-white/10 rounded-full px-4 py-1.5 hover:bg-white/20 transition-colors duration-300 cursor-pointer"
              onClick={handleHomeRedirect}
            >
              <Link to="/" className="flex items-center">
                <span className="text-white font-medium">
                  Welcome, {username}
                </span>
                <i className="fas fa-home ml-2 text-blue-300"></i>
              </Link>
            </div>

            <button
              onClick={logout}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
    </header>
  );
};

export default AdminHeader;
