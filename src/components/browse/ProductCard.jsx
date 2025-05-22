import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import ProductDetailModal from "./ProductDetailModal";

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const getFeatures = () => {
    if (!product.features) return [];
    if (typeof product.features === "string") {
      return product.features.split(/\s*,\s*/);
    }
    return product.features;
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  const handleRentClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/rent-item/${product.id}` } });
    } else {
      navigate(`/rent-item/${product.id}`);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-transparent group"
        data-category={product.category}
        data-status={product.status}
        data-price={product.price}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <StatusBadge
            status={product.status}
            className="absolute top-3.5 right-3.5 shadow-sm z-20"
          />

          <div className="absolute inset-0 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
            <button
              onClick={handleQuickView}
              className="mb-4 bg-white/90 hover:bg-white backdrop-blur-sm text-blue-600 font-medium py-1.5 px-4 rounded-full text-sm transition-all duration-300 flex items-center space-x-1.5 hover:shadow-md transform group-hover:translate-y-0 translate-y-4"
            >
              <i className="fas fa-eye"></i>
              <span>Quick View</span>
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {getFeatures()
              .slice(0, 2)
              .map((feature, index) => (
                <span
                  key={index}
                  className="text-[10px] uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium"
                >
                  {feature}
                </span>
              ))}
            {getFeatures().length > 2 && (
              <span className="text-[10px] uppercase tracking-wider bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                +{getFeatures().length - 2}
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-snug">
            {product.description}
          </p>

          <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
            <div>
              <span className="font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">
                /{product.price_type}
              </span>
            </div>
            <button
              onClick={handleRentClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 px-3 rounded-md transition-all duration-300 flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <i className="fas fa-shopping-cart text-[10px]"></i>
              <span>Rent</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <ProductDetailModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ProductCard;
