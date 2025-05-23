import React, { useState } from "react";
import AdminModal from "../ui/AdminModal";

const ProductEditModal = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [status, setStatus] = useState(product.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      name,
      category,
      price: Number(price),
      status,
    });
  };

  return (
    <AdminModal title="Edit Product" onClose={onClose} size="sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="admin-form-input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="admin-form-input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="admin-form-input"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="admin-form-input"
          >
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>
        <div className="admin-btn-container">
          <button
            type="button"
            onClick={onClose}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="admin-btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default ProductEditModal;
