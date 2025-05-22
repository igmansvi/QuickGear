import React from "react";
import { useNavigate } from "react-router-dom";

const ListingSuccessModal = ({
  show,
  onClose,
  onListAnother,
  onViewProducts,
}) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleListAnother = () => {
    if (onListAnother) {
      onListAnother();
    } else {
      onClose?.();
      navigate("/list-item");
    }
  };

  const handleViewProducts = () => {
    if (onViewProducts) {
      onViewProducts();
    } else {
      onClose?.();
      navigate("/browse");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"></div>

      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-8 transform transition-all duration-300 scale-100 opacity-100 modal-animate-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <i className="fas fa-check text-2xl text-green-600"></i>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Product Added Successfully!
          </h2>

          <p className="text-gray-700 mb-6">
            Your product has been successfully added to our rental inventory.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleListAnother}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300"
            >
              List Another
            </button>
            <button
              onClick={handleViewProducts}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-300"
            >
              View Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingSuccessModal;
