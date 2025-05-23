import React, { useState, useEffect } from "react";
import StatCardSkeleton from "./ui/StatCardSkeleton";
import AddProductModal from "./modals/AddProductModal";

const ProductsSection = ({
  products,
  loading,
  onEditProduct,
  onAddProduct,
}) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter, sortBy, sortOrder]);

  const filterProducts = () => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (statusFilter) {
      result = result.filter(
        (product) => product.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort the results
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "price") {
        comparison = a.price - b.price;
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProducts(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setSortBy("name");
    setSortOrder("asc");
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleAddProductSubmit = (productData) => {
    onAddProduct(productData);
    setShowAddModal(false);
  };

  const productStats = {
    total: filteredProducts.length,
    available: filteredProducts.filter((p) => p.status === "available").length,
    rented: filteredProducts.filter((p) => p.status === "rented").length,
    comingSoon: filteredProducts.filter((p) => p.status === "coming_soon")
      .length,
  };

  const categories = Array.from(
    new Set(products.map((product) => product.category))
  );

  const statCards = [
    {
      title: "Total Products",
      value: productStats.total,
      bgClass: "bg-blue-50",
      textClass: "text-blue-600",
      icon: "fa-boxes",
    },
    {
      title: "Available",
      value: productStats.available,
      bgClass: "bg-green-50",
      textClass: "text-green-600",
      icon: "fa-check-circle",
    },
    {
      title: "Rented",
      value: productStats.rented,
      bgClass: "bg-yellow-50",
      textClass: "text-yellow-600",
      icon: "fa-clock",
    },
    {
      title: "Coming Soon",
      value: productStats.comingSoon,
      bgClass: "bg-purple-50",
      textClass: "text-purple-600",
      icon: "fa-calendar-plus",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Products Management
        </h2>
        <div className="flex flex-wrap justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            Manage your product inventory, update details and track status.
          </p>
          <button
            id="add-product-btn"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus mr-2"></i> Add New Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or category..."
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            <i className="fas fa-sync-alt mr-1"></i> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((card, index) => (
            <div key={index} className={`${card.bgClass} p-4 rounded-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-sm ${card.textClass}`}>{card.title}</p>
                  <p className="text-xl font-bold">{card.value}</p>
                </div>
                <div className={`${card.bgClass} p-2 rounded-full`}>
                  <i
                    className={`fas ${card.icon} ${card.textClass} text-xl`}
                  ></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Products List</h3>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-lg px-3 py-1 mr-2 text-sm"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={toggleSortOrder}
            className="border rounded-lg px-3 py-1 flex items-center"
            title={sortOrder === "asc" ? "Ascending" : "Descending"}
          >
            <i
              className={`fas fa-sort-${
                sortOrder === "asc" ? "up" : "down"
              } text-gray-600`}
            ></i>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-8 bg-gray-100 rounded mb-2"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <i className="fas fa-search text-4xl mb-4 block"></i>
            <p>
              No products match your filters. Try changing your search criteria.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <table className="min-w-full bg-white border">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 border text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{product.id}</td>
                  <td className="py-2 px-4 border">
                    <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/40?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <i className="fas fa-image"></i>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border font-medium text-gray-800">
                    {product.name}
                  </td>
                  <td className="py-2 px-4 border">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === "available"
                          ? "bg-green-100 text-green-800"
                          : product.status === "rented"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => onEditProduct(product)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProductSubmit}
        />
      )}
    </div>
  );
};

export default ProductsSection;
