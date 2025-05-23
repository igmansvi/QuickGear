import React, { useState, useEffect } from "react";

const ProductsSection = ({ products, loading, onEditProduct }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter, statusFilter]);

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

    setFilteredProducts(result);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  const productStats = {
    total: filteredProducts.length,
    available: filteredProducts.filter((p) => p.status === "available").length,
    rented: filteredProducts.filter((p) => p.status === "rented").length,
    comingSoon: filteredProducts.filter((p) => p.status === "coming_soon")
      .length,
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
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
            <option value="tech">Tech</option>
            <option value="tools">Tools</option>
            <option value="events">Events</option>
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
            onClick={filterProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">Total Products</p>
          <p className="text-xl font-bold">{productStats.total}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Available</p>
          <p className="text-xl font-bold">{productStats.available}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-600">Rented</p>
          <p className="text-xl font-bold">{productStats.rented}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <p className="text-sm text-purple-600">Coming Soon</p>
          <p className="text-xl font-bold">{productStats.comingSoon}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800">Products</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Price</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-center hover:bg-gray-50">
                <td className="py-1 px-2 border">{product.id}</td>
                <td className="py-1 px-2 border">{product.name}</td>
                <td className="py-1 px-2 border">{product.category}</td>
                <td className="py-1 px-2 border">
                  ₹{product.price.toLocaleString()}
                </td>
                <td className="py-1 px-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                <td className="py-1 px-2 border">
                  <button
                    className="text-blue-600 hover:text-blue-800 mx-1"
                    onClick={() => onEditProduct(product)}
                  >
                    <i className="fas fa-edit"></i> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsSection;
