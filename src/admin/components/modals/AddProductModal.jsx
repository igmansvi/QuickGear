import React, { useState, useRef } from "react";
import AdminModal from "./AdminModal";

const AddProductModal = ({ categories, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    status: "available",
    description: "",
    features: "",
    deposit: "",
    price_type: "day",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    setNewProduct((prev) => ({
      ...prev,
      image: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        <div className="mx-auto rounded-full bg-gradient-to-r from-blue-50 to-blue-100 w-16 h-16 flex items-center justify-center mb-4 shadow-inner">
          <i className="fas fa-box-open text-blue-500 text-3xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
          New Product
        </h3>
        <p className="text-gray-600">Add a new product to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-6 md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <div
            onClick={handleImageClick}
            className={`w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
              previewImage
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {previewImage ? (
              <div className="relative w-full h-full">
                <img
                  src={previewImage}
                  alt="Product preview"
                  className="w-full h-full object-contain p-2"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ) : (
              <>
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                <p className="text-gray-500 text-center">
                  <span className="font-medium text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                  <br />
                  <span className="text-sm">
                    SVG, PNG, JPG or GIF (max. 2MB)
                  </span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Name<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-box-open"></i>
              </span>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Category<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-tags"></i>
              </span>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
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
          </div>

          {newProduct.category === "new" && (
            <div className="md:col-span-2 group">
              <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
                New Category Name<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <i className="fas fa-plus-circle"></i>
                </span>
                <input
                  type="text"
                  name="newCategory"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                  required
                />
              </div>
            </div>
          )}

          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Price (₹)<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-rupee-sign"></i>
              </span>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                min="0"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Price Type
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-calendar"></i>
              </span>
              <select
                name="price_type"
                value={newProduct.price_type}
                onChange={handleInputChange}
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
                <option value="day">Per Day</option>
                <option value="hour">Per Hour</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Security Deposit (₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-shield-alt"></i>
              </span>
              <input
                type="number"
                name="deposit"
                value={newProduct.deposit}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                min="0"
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
                name="status"
                value={newProduct.status}
                onChange={handleInputChange}
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
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Features (comma-separated)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fas fa-list-ul"></i>
              </span>
              <input
                type="text"
                name="features"
                value={newProduct.features}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 shadow-sm"
                placeholder="e.g. Lightweight, Portable, High Resolution"
              />
            </div>
          </div>

          <div className="md:col-span-2 group">
            <label className="block text-gray-700 font-medium mb-2 group-focus-within:text-blue-600 transition-colors duration-200">
              Description
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-gray-500">
                <i className="fas fa-align-left"></i>
              </span>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-700 resize-none shadow-sm"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300 border border-gray-300 shadow-sm hover:shadow flex items-center"
          >
            <i className="fas fa-times mr-2"></i> Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center"
          >
            <i className="fas fa-plus-circle mr-2"></i> Add Product
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default AddProductModal;
