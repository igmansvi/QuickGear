import React from "react";

const Howitworks = () => {
  return (
    <div id="how-it-works" className="how-it-works-section py-16">
      <div className="page-container">
        <div className="section-header text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            How It Works
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4">
            Renting made simple in just three steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="step">
            <div className="icon bg-blue-600 text-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transform transition duration-300 hover:scale-110">
              <i className="fas fa-search text-2xl"></i>
            </div>
            <h4 className="font-bold text-gray-800">Browse</h4>
            <p className="text-gray-600">
              Explore our collection of premium equipment.
            </p>
          </div>
          <div className="step">
            <div className="icon bg-blue-600 text-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transform transition duration-300 hover:scale-110">
              <i className="fas fa-calendar-alt text-2xl"></i>
            </div>
            <h4 className="font-bold text-gray-800">Book</h4>
            <p className="text-gray-600">
              Select your dates and confirm your booking.
            </p>
          </div>
          <div className="step">
            <div className="icon bg-blue-600 text-white w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 transform transition duration-300 hover:scale-110">
              <i className="fas fa-truck text-2xl"></i>
            </div>
            <h4 className="font-bold text-gray-800">Receive</h4>
            <p className="text-gray-600">
              Get your equipment delivered to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Howitworks;