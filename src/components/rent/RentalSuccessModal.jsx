import React from "react";

const RentalSuccessModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>

      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-8 transform transition-all duration-300 scale-100 opacity-100 modal-animate-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <i className="fas fa-check text-2xl text-green-600"></i>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Request Received
          </h2>

          <p className="text-gray-700 mb-6">
            Thank you! Your rental request has been received successfully.
          </p>

          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300 w-full"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalSuccessModal;
