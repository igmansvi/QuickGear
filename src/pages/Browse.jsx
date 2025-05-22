import React, { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/browse/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Browse = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const { isAuthenticated } = useAuth();
  const { products } = useProducts();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/browse" } });
      return;
    }
  }, [isAuthenticated, navigate]);

  const categories = [...new Set(products.map((product) => product.category))];

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchText.toLowerCase()) ||
        product.description.toLowerCase().includes(searchText.toLowerCase());

      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;

      const matchesStatus =
        !availabilityFilter || product.status === availabilityFilter;

      const matchesPrice = checkPriceRange(product.price, priceFilter);

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    setFilteredProducts(filtered);

    const newActiveFilters = {};
    if (searchText) newActiveFilters.search = searchText;
    if (categoryFilter) newActiveFilters.category = categoryFilter;
    if (availabilityFilter) newActiveFilters.availability = availabilityFilter;
    if (priceFilter) newActiveFilters.price = priceFilter;
    setActiveFilters(newActiveFilters);
  }, [searchText, categoryFilter, availabilityFilter, priceFilter, products]);

  const checkPriceRange = (price, range) => {
    if (!range) return true;
    if (range === "2001+") return price >= 2001;
    const [min, max] = range.split("-").map(Number);
    return price >= min && price <= max;
  };

  const clearFilter = (filterName) => {
    switch (filterName) {
      case "search":
        setSearchText("");
        break;
      case "category":
        setCategoryFilter("");
        break;
      case "availability":
        setAvailabilityFilter("");
        break;
      case "price":
        setPriceFilter("");
        break;
      default:
        break;
    }
  };

  const getFilterDisplayText = (filterName, value) => {
    if (filterName === "price") {
      if (value === "0-500") return "Under ₹500/day";
      if (value === "501-2000") return "₹501 - ₹2000/day";
      if (value === "2001+") return "Above ₹2000/day";
    }
    if (filterName === "availability") {
      return value.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (filterName === "category") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  };

  return (
    <main className="py-12 bg-[#fafafa]">
      <div className="page-container">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center relative inline-block">
          Browse Equipment
          <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
        </h2>

        <div className="mb-8 bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col gap-5">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search equipment..."
                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         pl-12 text-gray-600 placeholder-gray-400"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                           appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>

              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                           appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="available">Available Now</option>
                  <option value="rented">Rented</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>

              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
                           appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">Any Price</option>
                  <option value="0-500">Under ₹500/day</option>
                  <option value="501-2000">₹501 - ₹2000/day</option>
                  <option value="2001+">Above ₹2000/day</option>
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {Object.entries(activeFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                  {getFilterDisplayText(key, value)}
                  <button
                    className="ml-2 hover:text-blue-600"
                    onClick={() => clearFilter(key)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
            <p>No items found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchText("");
                setCategoryFilter("");
                setAvailabilityFilter("");
                setPriceFilter("");
              }}
              className="mt-3 text-blue-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="text-gray-600 mt-2 mb-6 text-sm text-center">
              Showing {filteredProducts.length} of {products.length} items
            </div>
            <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-10 flex justify-center">
          <nav className="inline-flex rounded-lg shadow-sm">
            <button className="px-4 py-2 border border-r-0 rounded-l-lg bg-white hover:bg-gray-50 text-gray-600">
              <i className="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <button className="px-4 py-2 border border-r-0 bg-blue-600 text-white">
              1
            </button>
            <button className="px-4 py-2 border rounded-r-lg bg-white hover:bg-gray-50 text-gray-600">
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
};

export default Browse;
