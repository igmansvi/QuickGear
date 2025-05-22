import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/apiService";

const categories = {
  cameras: { name: "Cameras" },
  audio: { name: "Audio Equipment" },
  computers: { name: "Computers" },
  lighting: { name: "Lighting" },
  drones: { name: "Drones" },
  other: { name: "Other Equipment" },
};

const ListForm = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    price_type: "day",
    deposit: "",
    status: "available",
    features: "",
    product_image: null,
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const getMaxPriceByType = (type) => {
    switch (type) {
      case "day":
        return 100000;
      case "week":
        return 500000;
      case "month":
        return 1000000;
      default:
        return 100000;
    }
  };

  useEffect(() => {
    if (
      formData.price &&
      parseFloat(formData.price) > getMaxPriceByType(formData.price_type)
    ) {
      setErrors({
        ...errors,
        price: `Maximum price for ${
          formData.price_type
        } rental is ₹${getMaxPriceByType(
          formData.price_type
        ).toLocaleString()}`,
      });
    } else if (errors.price) {
      const error = validateField("price", formData.price);
      if (error) {
        setErrors({ ...errors, price: error });
      } else {
        const { price, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  }, [formData.price_type]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) error = "Product name is required";
        else if (value.trim().length < 5)
          error = "Name must be at least 5 characters";
        else if (value.trim().length > 100)
          error = "Name must be less than 100 characters";
        break;

      case "category":
        if (!value) error = "Category is required";
        break;

      case "description":
        if (!value.trim()) error = "Description is required";
        else if (value.trim().length < 20)
          error = "Description must be at least 20 characters";
        else if (value.trim().length > 1000)
          error = "Description must be less than 1000 characters";
        break;

      case "price":
        if (!value) error = "Rental price is required";
        else if (isNaN(parseFloat(value))) error = "Price must be a number";
        else if (parseFloat(value) <= 0) error = "Price must be positive";
        else if (parseFloat(value) > getMaxPriceByType(formData.price_type))
          error = `Maximum price for ${
            formData.price_type
          } rental is ₹${getMaxPriceByType(
            formData.price_type
          ).toLocaleString()}`;
        break;

      case "deposit":
        if (value === "") error = "Deposit amount is required";
        else if (isNaN(parseFloat(value))) error = "Deposit must be a number";
        else if (parseFloat(value) < 0) error = "Deposit must be at least 0";
        else if (parseFloat(value) > parseFloat(formData.price) * 10)
          error = "Deposit cannot exceed 10x the rental price";
        break;

      case "features":
        if (!value.trim()) error = "At least one feature is required";
        else {
          const features = value
            .split(",")
            .map((f) => f.trim())
            .filter((f) => f);
          if (features.length === 0) error = "At least one feature is required";
          else if (features.length > 10) error = "Maximum 10 features allowed";
          else {
            const invalidFeatures = features.filter(
              (f) => f.length < 2 || f.length > 50
            );
            if (invalidFeatures.length > 0)
              error = "Each feature must be between 2-50 characters";
          }
        }
        break;

      case "product_image":
        if (!value) error = "Product image is required";
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });

    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    } else if (errors[name]) {
      const { [name]: _, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "deposit") {
      const numericRegex = /^[0-9]*\.?[0-9]{0,2}$/;
      if (value === "" || numericRegex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (touchedFields[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors({ ...errors, [name]: error });
      } else if (errors[name]) {
        const { [name]: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const handleFeaturesChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, features: value });

    if (touchedFields.features) {
      const error = validateField("features", value);
      if (error) {
        setErrors({ ...errors, features: error });
      } else if (errors.features) {
        const { features: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          product_image: "Please upload a JPG, PNG, GIF, or WEBP file",
        });
        setImagePreview(null);
        return;
      }

      if (file.size > maxSize) {
        setErrors({
          ...errors,
          product_image: "Image must be less than 5MB",
        });
        setImagePreview(null);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData({
        ...formData,
        product_image: file,
      });

      setTouchedFields({ ...touchedFields, product_image: true });

      if (errors.product_image) {
        const { product_image, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      product_image: null,
    });
    if (touchedFields.product_image) {
      setErrors({
        ...errors,
        product_image: "Product image is required",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const productFormData = new FormData();

      productFormData.append("name", formData.name);
      productFormData.append("category", formData.category);
      productFormData.append("description", formData.description);
      productFormData.append("price", formData.price);
      productFormData.append("price_type", formData.price_type);
      productFormData.append("deposit", formData.deposit);
      productFormData.append("status", formData.status);
      productFormData.append("features", formData.features);
      productFormData.append("user_id", user.id);

      if (formData.product_image) {
        productFormData.append("product_image", formData.product_image);
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        price_type: formData.price_type,
        deposit: parseFloat(formData.deposit),
        status: formData.status,
        features: formData.features,
        user_id: user.id,
      };

      const newProduct = await ApiService.products.create(productData);
      console.log("Product created:", newProduct);

      onSuccess();

      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        price_type: "day",
        deposit: "",
        status: "available",
        features: "",
        product_image: null,
      });
      setImagePreview(null);
      setErrors({});
      setTouchedFields({});
    } catch (error) {
      console.error("Error adding product:", error);
      onError(error.message || "Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFeatureCount = () => {
    if (!formData.features.trim()) return 0;
    return formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f).length;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-1"
          htmlFor="name"
        >
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter product name"
          className={`w-full px-3 py-2 border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.name}
        />
        {errors.name && (
          <div className="text-red-500 text-sm mt-1">{errors.name}</div>
        )}
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-1"
          htmlFor="category"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          className={`w-full px-3 py-2 border ${
            errors.category ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.category}
        >
          <option value="" disabled>
            Select Category
          </option>
          {Object.entries(categories).map(([key, category]) => (
            <option key={key} value={key}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <div className="text-red-500 text-sm mt-1">{errors.category}</div>
        )}
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-1"
          htmlFor="description"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Provide a detailed description (min 20 characters)"
          className={`w-full px-3 py-2 border ${
            errors.description ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none resize-none`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={formData.description}
          maxLength={1000}
        ></textarea>
        <div className="flex justify-between items-center mt-1">
          {errors.description && (
            <div className="text-red-500 text-sm">{errors.description}</div>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {formData.description.length}/1000
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="price"
          >
            Rental Price (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <input
              type="text"
              id="price"
              name="price"
              placeholder="0.00"
              className={`w-full px-3 py-2 pl-7 border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.price}
            />
          </div>
          {errors.price && (
            <div className="text-red-500 text-sm mt-1">{errors.price}</div>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="price_type"
          >
            Price Type <span className="text-red-500">*</span>
          </label>
          <select
            id="price_type"
            name="price_type"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none"
            onChange={handleChange}
            value={formData.price_type}
          >
            <option value="day">Per Day</option>
            <option value="week">Per Week</option>
            <option value="month">Per Month</option>
          </select>
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="deposit"
          >
            Security Deposit (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              ₹
            </span>
            <input
              type="text"
              id="deposit"
              name="deposit"
              placeholder="0.00"
              className={`w-full px-3 py-2 pl-7 border ${
                errors.deposit ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={formData.deposit}
            />
          </div>
          {errors.deposit && (
            <div className="text-red-500 text-sm mt-1">{errors.deposit}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="status"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none"
            onChange={handleChange}
            value={formData.status}
          >
            <option value="available">Available Now</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
          {errors.status && (
            <div className="text-red-500 text-sm mt-1">{errors.status}</div>
          )}
        </div>

        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="features"
          >
            Features (comma separated) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="features"
            name="features"
            placeholder="e.g., 4K Video, Dual Pixel AF, Stabilization"
            className={`w-full px-3 py-2 border ${
              errors.features ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 transition outline-none`}
            onChange={handleFeaturesChange}
            onBlur={handleBlur}
            value={formData.features}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.features && (
              <div className="text-red-500 text-sm">{errors.features}</div>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              {getFeatureCount()}/10 features
            </span>
          </div>
        </div>
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-medium mb-1"
          htmlFor="product_image"
        >
          Product Image <span className="text-red-500">*</span>
        </label>

        {imagePreview ? (
          <div className="mb-3 relative">
            <img
              src={imagePreview}
              alt="Product preview"
              className="w-full max-h-60 object-contain border rounded-lg shadow-sm"
            />
            <button
              type="button"
              onClick={clearImagePreview}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed ${
              errors.product_image
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50"
            } rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-colors`}
            onClick={() => document.getElementById("product_image").click()}
          >
            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
            <p className="text-sm text-gray-500">
              Click to upload JPG, PNG, GIF or WEBP (max 5MB)
            </p>
          </div>
        )}

        <input
          type="file"
          id="product_image"
          name="product_image"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {errors.product_image && (
          <div className="text-red-500 text-sm mt-1">
            {errors.product_image}
          </div>
        )}
      </div>

      <div className="pt-3">
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-3 rounded-lg transition-all duration-300 ${
            isSubmitting || Object.keys(errors).length > 0
              ? "opacity-70 cursor-not-allowed"
              : "transform hover:-translate-y-0.5 hover:shadow-md"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>{" "}
              Submitting...
            </>
          ) : (
            <>
              <i className="fas fa-list-alt mr-2"></i> Submit Listing
            </>
          )}
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <p>Please fix the errors above before submitting.</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default ListForm;