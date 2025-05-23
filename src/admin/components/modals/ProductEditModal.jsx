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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 resize-none"
            rows="4"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
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
            <i className="fas fa-save mr-2"></i> Save Changes
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductEditModal;
