import React, { useState } from "react";
import AdminModal from "../ui/AdminModal";

const AddProductModal = ({ categories, onClose, onSave }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    status: "available",
    description: "",
    features: "",
    deposit: "",
    price_type: "day",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Please fill in all required fields");
      return;
    }

    const formattedProduct = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      deposit: newProduct.deposit ? parseFloat(newProduct.deposit) : 0,
      features: newProduct.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f),
    };

    onSave(formattedProduct);
  };

  return (
    <AdminModal title="Add New Product" onClose={onClose} size="md">
      <div className="text-center mb-6">
        <div className="mx-auto rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mb-4">
          <i className="fas fa-box-open text-blue-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2">New Product</h3>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category<span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">+ Add New Category</option>
            </select>
          </div>

          {newProduct.category === "new" && (
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                New Category Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="newCategory"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price (₹)<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price Type
            </label>
            <select
              name="price_type"
              value={newProduct.price_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            >
              <option value="day">Per Day</option>
              <option value="hour">Per Hour</option>
              <option value="week">Per Week</option>
              <option value="month">Per Month</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Security Deposit (₹)
            </label>
            <input
              type="number"
              name="deposit"
              value={newProduct.deposit}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Status
            </label>
            <select
              name="status"
              value={newProduct.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            >
              <option value="available">Available</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Features (comma-separated)
            </label>
            <input
              type="text"
              name="features"
              value={newProduct.features}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              placeholder="e.g. Lightweight, Portable, High Resolution"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 resize-none"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            <i className="fas fa-plus-circle mr-2"></i> Add Product
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default AddProductModal;
