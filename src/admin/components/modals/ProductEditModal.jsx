import React, { useState } from "react";
import AdminModal from "../ui/AdminModal";

const ProductEditModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [status, setStatus] = useState(product.status);
  const [description, setDescription] = useState(product.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      name,
      category,
      price: Number(price),
      status,
      description,
    });
  };

  return (
    <AdminModal title="Edit Product" onClose={onClose} size="md">
      <div className="text-center mb-8">
        <div className="mx-auto rounded-full bg-gradient-to-r from-blue-50 to-blue-100 w-20 h-20 flex items-center justify-center mb-4 shadow-inner">
          <i className="fas fa-edit text-blue-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
          {name}
        </h3>
        <p className="text-gray-600">Update product details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
            Product Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fas fa-box-open"></i>
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
            Category
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fas fa-tags"></i>
            </span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
            Price (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fas fa-rupee-sign"></i>
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
            Status
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <i className="fas fa-toggle-on"></i>
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm appearance-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundPosition: "right 0.5rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
                paddingRight: "2.5rem",
              }}
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
        </div>

        <div className="group">
          <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
            Description
          </label>
          <div className="relative">
            <span className="absolute top-3 left-3 text-gray-500">
              <i className="fas fa-align-left"></i>
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 resize-none shadow-sm"
              rows="4"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 border border-gray-300 shadow-sm hover:shadow flex items-center"
          >
            <i className="fas fa-times mr-2"></i> Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center"
          >
            <i className="fas fa-save mr-2"></i> Save Changes
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductEditModal;
