import React, { useState } from "react";
import AdminModal from "../ui/AdminModal";

const AddProductModal = ({ categories, onClose, onSave }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    status: "available",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Please fill in all required fields");
      return;
    }

    const formattedProduct = {
      ...newProduct,
      price: parseFloat(newProduct.price),
    };

    onSave(formattedProduct);
  };

  return (
    <AdminModal title="Add New Product" onClose={onClose} size="md">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </label>
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category*
          </label>
          <select
            name="category"
            value={newProduct.category}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Category Name*
            </label>
            <input
              type="text"
              name="newCategory"
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)*
          </label>
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={newProduct.status}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:outline-none"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>
    </AdminModal>
  );
};

export default AddProductModal;
