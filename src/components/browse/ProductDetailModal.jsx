import React from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../ui/Modal";
import StatusBadge from "../ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { useReviews } from "../../context/ReviewContext";
import ReviewOverlay from "./ReviewOverlay";

const ProductDetailModal = ({ product, onClose }) => {
  const { isAuthenticated } = useAuth();
  const { getProductReviews } = useReviews();
  const navigate = useNavigate();

  if (!product) return null;

  const productReviews = getProductReviews(product.id);

  const getFeatures = () => {
    if (!product.features) return [];
    if (typeof product.features === "string") {
      return product.features.split(/\s*,\s*/);
    }
    return product.features;
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/rent-item/${product.id}` } });
    } else {
      navigate(`/rent-item/${product.id}`);
    }
    onClose();
  };

  return (
    <Modal onClose={onClose} size="lg">
      <div className="flex flex-col md:flex-row max-h-[85vh]">
        <div className="w-full md:w-1/2 relative">
          <div className="h-64 md:h-full overflow-hidden bg-gradient-to-r from-blue-50 to-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <StatusBadge
              status={product.status}
              className="absolute top-4 right-4 shadow-md z-20"
            />
            <ReviewOverlay reviews={productReviews} />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                  {product.category.charAt(0).toUpperCase() +
                    product.category.slice(1)}
                </span>
                <span className="text-gray-500 text-sm flex items-center">
                  <i className="fas fa-tag mr-1 text-blue-500"></i> ID:{" "}
                  {product.id}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>
            </div>

            {productReviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-2">
                  Customer Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i <
                            productReviews.reduce(
                              (acc, rev) => acc + rev.rating,
                              0
                            ) /
                              productReviews.length
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {(
                      productReviews.reduce((acc, rev) => acc + rev.rating, 0) /
                      productReviews.length
                    ).toFixed(1)}{" "}
                    from {productReviews.length} review
                    {productReviews.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
                Features
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {getFeatures().map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                  >
                    <i className="fas fa-check text-blue-500 mr-1.5 text-[10px]"></i>
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm uppercase tracking-wide text-gray-500 font-medium mb-3">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Availability</div>
                  <div className="font-medium text-gray-800 capitalize">
                    {product.status.replace("_", " ")}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Rental Type</div>
                  <div className="font-medium text-gray-800 capitalize">
                    Per {product.price_type}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Rental Price</div>
                  <div className="font-medium text-gray-800">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">
                    Security Deposit
                  </div>
                  <div className="font-medium text-gray-800">
                    ₹{product.deposit?.toLocaleString() || "0"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRentNow}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <i className="fas fa-shopping-cart"></i>
                  <span>Rent Now</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
