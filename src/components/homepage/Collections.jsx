import React, { useState, useRef } from "react";
import { useProducts } from "../../context/ProductContext";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatusBadge from "../ui/StatusBadge";

const Collections = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef(null);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  useIntersectionObserver(sectionRef);

  const handleViewDetails = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/browse");
    }
  };

  return (
    <div id="products" className="py-16 md:py-20 bg-[#fafafa]" ref={sectionRef}>
      <div className="page-container">
        <div className="section-header text-center mb-12 lazy-load">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            Rental Collection
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Quality equipment for rent at affordable prices across major Indian
            cities
          </p>
        </div>

        <div className="category-filter flex justify-center flex-wrap gap-3 mb-10">
          {["all", "tech", "tools", "events"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn px-5 py-2.5 rounded-full transition-all duration-500 ease-out
                ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              data-category={cat}
            >
              {cat === "tech"
                ? "Electronics"
                : cat === "events"
                ? "Event Equipment"
                : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-12">
          {filteredProducts.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={handleViewDetails}
              className="lazy-load bg-white rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 group"
              data-category={product.category}
            >
              <div className="product-image relative h-52 md:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10"></div>
                <img
                  className="w-full h-full object-cover transition-transform duration-700 ease-in group-hover:scale-105"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
                <StatusBadge
                  status={product.status}
                  className="absolute top-3 right-3 shadow-md z-20"
                />

                <Link
                  to="#"
                  onClick={handleViewDetails}
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white py-2 text-center text-sm font-medium transform translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 z-10"
                >
                  View Details
                </Link>
              </div>

              <div className="product-details p-5 border-t border-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="product-meta flex justify-between items-center">
                  <span className="price font-bold text-gray-800 text-lg">
                    ₹{Number(product.price).toLocaleString()}/
                    <span className="text-sm text-gray-600">
                      {product.price_type}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all text-center">
          <Link
            to="/browse"
            className="view-all-btn inline-block px-8 py-3 border-2 border-gray-300 rounded-full text-gray-800 font-semibold transition-all duration-500 ease-out hover:bg-gray-800 hover:text-white hover:border-gray-800 hover:-translate-y-1 hover:shadow-lg"
          >
            View All Rentals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Collections;
