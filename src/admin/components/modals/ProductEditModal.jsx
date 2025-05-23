import React, { useState, useRef } from "react";
import AdminModal from "../ui/AdminModal";

const ProductEditModal = ({ product, onClose, onSave }) => {
  const fileInputRef = useRef(null);
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [status, setStatus] = useState(product.status);
  const [description, setDescription] = useState(product.description || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(product.image_url || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...product,
      name,
      category,
      price: Number(price),
      status,
      description,
      image: image,
      image_url: !image && imagePreview ? imagePreview : undefined,
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
        {/* Product Image Section */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border-gray-300 hover:border-blue-400 hover:bg-gray-50 relative overflow-hidden"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=Image+Error";
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
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
