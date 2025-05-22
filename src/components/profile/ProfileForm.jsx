import React, { useState, useEffect } from "react";

const ProfileForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current_password: false,
    new_password: false,
    confirm_password: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (formSubmitted) {
      validateField(name, value);
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleFocus = (name) => {
    setFocused({ ...focused, [name]: true });
  };

  const handleBlur = (name) => {
    setFocused({ ...focused, [name]: false });
    validateField(name, formData[name]);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "full_name":
        if (!value.trim()) {
          newErrors.full_name = "Name is required";
        } else if (value.length < 3) {
          newErrors.full_name = "Name must be at least 3 characters";
        } else {
          delete newErrors.full_name;
        }
        break;
      case "phone":
        const phoneRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          newErrors.phone = "Please enter a valid 10-digit phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      case "current_password":
        if (formData.new_password && !value) {
          newErrors.current_password =
            "Current password is required to set new password";
        } else {
          delete newErrors.current_password;
        }
        break;
      case "new_password":
        if (value && value.length < 6) {
          newErrors.new_password = "Password must be at least 6 characters";
        } else {
          delete newErrors.new_password;
        }
        if (formData.confirm_password && value !== formData.confirm_password) {
          newErrors.confirm_password = "Passwords do not match";
        } else if (formData.confirm_password) {
          delete newErrors.confirm_password;
        }
        break;
      case "confirm_password":
        if (formData.new_password && !value) {
          newErrors.confirm_password = "Please confirm your new password";
        } else if (value !== formData.new_password) {
          newErrors.confirm_password = "Passwords do not match";
        } else {
          delete newErrors.confirm_password;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Name is required";
      isValid = false;
    } else if (formData.full_name.length < 3) {
      newErrors.full_name = "Name must be at least 3 characters";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    if (formData.current_password) {
      if (!formData.new_password) {
        newErrors.new_password = "Please provide a new password";
        isValid = false;
      } else if (formData.new_password.length < 6) {
        newErrors.new_password = "Password must be at least 6 characters";
        isValid = false;
      }

      if (!formData.confirm_password) {
        newErrors.confirm_password = "Please confirm your new password";
        isValid = false;
      } else if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
        isValid = false;
      }
    }

    if (formData.new_password && !formData.current_password) {
      newErrors.current_password =
        "Current password is required to set new password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validateForm()) {
      onSubmit({
        full_name: formData.full_name,
        phone: formData.phone,
        password: formData.new_password || user.password,
      });

      setFormData({
        ...formData,
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setFormSubmitted(false);
    }
  };

  const getInputClasses = (fieldName) => {
    return `w-full px-10 py-2.5 bg-gray-50 border rounded-lg 
      ${
        focused[fieldName]
          ? "ring-2 ring-blue-500 border-blue-500"
          : "border-gray-200"
      } 
      ${errors[fieldName] ? "border-red-500 bg-red-50" : ""} 
      transition-all duration-200`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg h-full">
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 bg-gradient-to-r from-blue-50 to-blue-100 border-4 border-white shadow-md flex items-center justify-center hover:scale-105 transition-transform duration-300">
          {user.profile_image ? (
            <img
              src={user.profile_image}
              alt={user.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <i className="fas fa-user text-blue-500 text-4xl"></i>
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{user.full_name}</h3>
        <p className="text-gray-600 text-sm">{user.email}</p>
        <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
          Member since {new Date(user.created_at || Date.now()).getFullYear()}
        </span>
      </div>

      <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200 flex items-center">
        <i className="fas fa-user-circle text-blue-600 mr-2"></i>
        Personal Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label
            htmlFor="full_name"
            className="block text-gray-700 font-medium mb-1 text-sm"
          >
            Full Name
          </label>
          <div className="relative">
            <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onFocus={() => handleFocus("full_name")}
              onBlur={() => handleBlur("full_name")}
              className={getInputClasses("full_name")}
            />
          </div>
          {errors.full_name && (
            <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
          )}
        </div>

        <div className="relative">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1 text-sm"
          >
            Email Address
          </label>
          <div className="relative">
            <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="email"
              id="email"
              name="email"
              readOnly
              value={formData.email}
              className="w-full px-10 py-2.5 border border-gray-200 rounded-lg bg-gray-100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        <div className="relative">
          <label
            htmlFor="phone"
            className="block text-gray-700 font-medium mb-1 text-sm"
          >
            Phone Number
          </label>
          <div className="relative">
            <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => handleFocus("phone")}
              onBlur={() => handleBlur("phone")}
              className={getInputClasses("phone")}
              placeholder="10-digit mobile number"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="border-t border-gray-100 pt-5 mt-5">
          <h3 className="font-medium mb-3 flex items-center text-sm">
            <i className="fas fa-key text-blue-500 mr-2"></i>
            Change Password (Optional)
          </h3>

          <div className="space-y-3">
            <div className="relative">
              <label
                htmlFor="current_password"
                className="block text-gray-700 font-medium mb-1 text-sm"
              >
                Current Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword.current_password ? "text" : "password"}
                  id="current_password"
                  name="current_password"
                  value={formData.current_password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("current_password")}
                  onBlur={() => handleBlur("current_password")}
                  className={getInputClasses("current_password")}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current_password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i
                    className={`fas ${
                      showPassword.current_password ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {errors.current_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.current_password}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="new_password"
                className="block text-gray-700 font-medium mb-1 text-sm"
              >
                New Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword.new_password ? "text" : "password"}
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("new_password")}
                  onBlur={() => handleBlur("new_password")}
                  className={getInputClasses("new_password")}
                  placeholder="Minimum 6 characters"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new_password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i
                    className={`fas ${
                      showPassword.new_password ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {errors.new_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.new_password}
                </p>
              )}
            </div>

            <div className="relative">
              <label
                htmlFor="confirm_password"
                className="block text-gray-700 font-medium mb-1 text-sm"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword.confirm_password ? "text" : "password"}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirm_password")}
                  onBlur={() => handleBlur("confirm_password")}
                  className={getInputClasses("confirm_password")}
                  placeholder="Re-enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm_password")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i
                    className={`fas ${
                      showPassword.confirm_password ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirm_password}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center hover:-translate-y-0.5 hover:shadow-md"
          >
            <i className="fas fa-save mr-2"></i> Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
