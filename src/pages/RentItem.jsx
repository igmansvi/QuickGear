import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RentForm from "../components/rent/RentForm";
import RentalSuccessModal from "../components/rent/RentalSuccessModal";
import ApiService from "../services/ApiService";

const RentItem = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/rent-item/${id}` } });
      return;
    }

    setIsLoading(true);

    const fetchProduct = async () => {
      try {
        const productData = await ApiService.products.getForRental(id);
        setProduct(productData);
        setError("");
      } catch (err) {
        setError(err.message || "Product not found.");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, isAuthenticated, navigate]);

  const handleRentalSuccess = () => {
    setShowModal(true);
  };

  const handleRentalError = (message) => {
    setError(message);
  };

  const handleModalClose = () => {
    navigate("/bookings");
  };

  const features = useMemo(() => {
    if (!product) return "";

    if (typeof product.features === "string") {
      return product.features;
    } else if (Array.isArray(product.features)) {
      return product.features.join(", ");
    }
    return "";
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="container mx-auto py-8">
        <p className="text-center text-red-500">
          {error || "Product not found."}
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl hover:shadow-blue-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-xl border border-gray-200 shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <div className="mb-4 space-y-2">
              <p className="text-lg">
                <span className="font-bold text-gray-800">Rental Price:</span>{" "}
                <span className="text-blue-600">
                  ₹{product.price.toLocaleString()}
                </span>{" "}
                per {product.price_type}
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-800">Deposit:</span>{" "}
                <span className="text-blue-600">
                  ₹{product.deposit.toLocaleString()}
                </span>
              </p>
              <p className="text-lg">
                <span className="font-bold text-gray-800">Features:</span>{" "}
                <span className="text-gray-600">{features}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-xl shadow-inner">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Rental Request
          </h3>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <RentForm
            productId={product.id}
            userId={user?.id}
            userData={user}
            onSuccess={handleRentalSuccess}
            onError={handleRentalError}
          />
        </div>
      </div>

      <RentalSuccessModal show={showModal} onClose={handleModalClose} />
    </main>
  );
};

export default RentItem;
