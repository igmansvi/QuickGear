import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import NotificationModal from "./NotificationModal";

const Header = () => {
  const { user, isAuthenticated, logout, unreadNotifications } = useAuth();
  const { openModal } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const header = headerRef.current;
    let lastScrollTop = 0;
    const onScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 100) {
        header.classList.add("py-2", "shadow-xl");
        header.classList.remove("py-4");
      } else {
        header.classList.add("py-4");
        header.classList.remove("py-2", "shadow-xl");
      }
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }
      lastScrollTop = scrollTop;
    };
    window.addEventListener("scroll", onScroll);

    const userBtn = document.getElementById("nav-user");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    if (userBtn && dropdownMenu) {
      userBtn.addEventListener("touchstart", function (e) {
        e.preventDefault();
        dropdownMenu.classList.toggle("scale-100");
      });
      document.addEventListener("click", function (e) {
        if (!userBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
          dropdownMenu.classList.remove("scale-100");
        }
      });
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="flex justify-between items-center px-4 md:px-8 py-4 bg-gradient-to-r from-[#2b2d42] to-[#4361ee] shadow-lg text-white sticky top-0 z-50 transition-all duration-300"
      >
        <Link
          to="/"
          className="flex items-center text-xl md:text-2xl font-bold hover:scale-105 transition-transform duration-300"
        >
          <i className="fas fa-tools mr-2 md:mr-3 text-2xl md:text-3xl text-[#3a86ff] drop-shadow-md"></i>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-[#a8dadc]">
            Quick Gear
          </span>
        </Link>

        <nav className="hidden md:flex gap-5">
          {isAuthenticated && (
            <>
              <Link
                id="nav-browse"
                to="/browse"
                className={`nav-link ${
                  isActive("/browse")
                    ? "bg-white/40 hover:bg-white/50"
                    : "bg-white/10 hover:bg-white/20"
                } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md flex items-center`}
              >
                <i className="fas fa-search mr-2 text-[#a8dadc]"></i>
                Browse
              </Link>

              <Link
                id="nav-home"
                to="/"
                className={`nav-link ${
                  isActive("/")
                    ? "bg-white/40 hover:bg-white/50"
                    : "bg-white/20 hover:bg-white/30"
                } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 shadow-lg shadow-white/10 flex items-center`}
              >
                <i className="fas fa-home mr-2 text-[#a8dadc]"></i>
                Home
              </Link>

              <Link
                id="nav-bookings"
                to="/bookings"
                className={`nav-link ${
                  isActive("/bookings")
                    ? "bg-white/40 hover:bg-white/50"
                    : "bg-white/10 hover:bg-white/20"
                } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-md flex items-center`}
              >
                <i className="fas fa-calendar-alt mr-2 text-[#a8dadc]"></i>
                Bookings
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <button
                onClick={openModal}
                className="relative bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                )}
              </button>

              <button
                onClick={toggleMobileMenu}
                className="md:hidden bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300"
                aria-label="Toggle mobile menu"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </>
          )}

          <div className="relative group">
            {isAuthenticated ? (
              <Link
                id="nav-user"
                to="/profile"
                className="user-btn relative bg-[#3a86ff] text-white border-none py-3 px-4 md:px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#a8dadc] hover:text-[#2b2d42] hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 overflow-hidden group"
              >
                <span className="relative z-10 hidden md:inline">
                  {user.full_name || user.email}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#3a86ff] to-[#a8dadc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <i className="fas fa-user relative z-10"></i>
              </Link>
            ) : (
              <Link
                id="nav-login"
                to="/login"
                className="user-btn relative bg-[#3a86ff] text-white border-none py-3 px-4 md:px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#a8dadc] hover:text-[#2b2d42] hover:-translate-y-0.5 hover:shadow-lg flex items-center gap-2 overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#3a86ff] to-[#a8dadc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <i className="fas fa-sign-in-alt relative z-10"></i>
              </Link>
            )}

            {isAuthenticated && (
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50 scale-0 origin-top transition-all duration-300 group-hover:scale-100 md:group-hover:scale-100 group-focus-within:scale-100">
                <Link
                  to="/list-item"
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-list mr-2 text-[#3a86ff]"></i> List Your
                  Item
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-user-circle mr-2 text-[#3a86ff]"></i>{" "}
                  Profile
                </Link>
                <div className="border-t border-gray-200"></div>
                <a
                  href="#"
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2 text-red-600"></i>{" "}
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {isAuthenticated && isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-[#2b2d42] to-[#4361ee] shadow-lg">
          <nav className="flex flex-col space-y-2 px-4 py-3">
            <Link
              to="/browse"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-link ${
                isActive("/browse")
                  ? "bg-white/40 hover:bg-white/50"
                  : "bg-white/10 hover:bg-white/20"
              } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center`}
            >
              <i className="fas fa-search mr-2 text-[#a8dadc]"></i>
              Browse
            </Link>

            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-link ${
                isActive("/")
                  ? "bg-white/40 hover:bg-white/50"
                  : "bg-white/20 hover:bg-white/30"
              } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center`}
            >
              <i className="fas fa-home mr-2 text-[#a8dadc]"></i>
              Home
            </Link>

            <Link
              to="/bookings"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`nav-link ${
                isActive("/bookings")
                  ? "bg-white/40 hover:bg-white/50"
                  : "bg-white/10 hover:bg-white/20"
              } text-white border-none py-3 px-6 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center`}
            >
              <i className="fas fa-calendar-alt mr-2 text-[#a8dadc]"></i>
              Bookings
            </Link>
          </nav>
        </div>
      )}

      <NotificationModal />
    </>
  );
};

export default Header;
