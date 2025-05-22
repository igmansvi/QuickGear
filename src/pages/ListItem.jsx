import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ListForm from "../components/list/ListForm";
import ListingSuccessModal from "../components/list/ListingSuccessModal";

const ListItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/list-item" } });
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleListingSuccess = () => {
    setShowModal(true);
  };

  const handleListingError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/browse");
  };

  const handleListAnother = () => {
    setShowModal(false);
    setError("");
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl hover:shadow-blue-300">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            List Your Equipment
          </h2>
          <p className="text-gray-600">
            Share your equipment with others and earn money through rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                  Equipment Details
                </h3>
                <p className="text-gray-600 text-center text-sm mb-4">
                  Fill in the information about your equipment to create a new
                  listing.
                </p>

                <div className="flex justify-center space-x-4 mb-4">
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-800">
                      <i className="fas fa-check mr-1 text-blue-500"></i> Set
                      your own prices
                    </p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-800">
                      <i className="fas fa-check mr-1 text-blue-500"></i> Choose
                      availability
                    </p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-800">
                      <i className="fas fa-check mr-1 text-blue-500"></i> Earn
                      from idle gear
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <ListForm
                onSuccess={handleListingSuccess}
                onError={handleListingError}
              />
            </div>
          </div>
        </div>
      </div>

      <ListingSuccessModal
        show={showModal}
        onClose={handleModalClose}
        onListAnother={handleListAnother}
        onViewProducts={handleModalClose}
      />
    </main>
  );
};

export default ListItem;
