import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  useEffect(() => {
    document.title = "Page Not Found | Quick Gear";

    const gearAnimation = () => {
      const primaryGear = document.getElementById("primary-gear");
      const secondaryGear = document.getElementById("secondary-gear");

      if (primaryGear && secondaryGear) {
        let rotation = 0;
        setInterval(() => {
          rotation += 1;
          primaryGear.style.transform = `rotate(${rotation}deg)`;
          secondaryGear.style.transform = `rotate(${-rotation}deg)`;
        }, 50);
      }
    };

    gearAnimation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 md:p-12 md:w-1/2 relative overflow-hidden">
            <div className="absolute opacity-10 inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
              <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white transform rotate-45"></div>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-center items-center text-center">
              <div className="relative mb-8 gear-animation-container">
                <i
                  id="primary-gear"
                  className="fas fa-cog text-9xl text-white opacity-90"
                ></i>
                <i
                  id="secondary-gear"
                  className="fas fa-cog text-5xl text-white opacity-80 absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2"
                ></i>
              </div>

              <h1 className="text-8xl font-bold mb-4 animate-pulse">404</h1>
              <p className="text-xl text-blue-100 mb-2">Page Not Found</p>
              <p className="text-blue-200 text-sm max-w-xs">
                The gear you're looking for seems to be missing from our
                inventory.
              </p>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-800 to-transparent opacity-30"></div>
          </div>

          <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Oops! We couldn't find that page
            </h2>

            <p className="text-gray-600 mb-8">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center h-8 w-8">
                  <i className="fas fa-search text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Search for equipment
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Browse our extensive collection of rental items
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center h-8 w-8">
                  <i className="fas fa-home text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Return to homepage
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Start fresh from our main page
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex items-center justify-center h-8 w-8">
                  <i className="fas fa-headset text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Contact support</h3>
                  <p className="text-gray-600 text-sm">
                    Get help from our customer service team
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-1 flex-1 text-center"
              >
                <i className="fas fa-home mr-2"></i> Go Home
              </Link>

              <Link
                to="/browse"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex-1 text-center"
              >
                <i className="fas fa-search mr-2"></i> Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
