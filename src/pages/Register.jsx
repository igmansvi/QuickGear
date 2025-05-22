import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setFormData({
        ...formData,
        [name]: value.trim().toLowerCase(),
      });
    } else if (name === "phone") {
      const formattedValue = value.replace(/\D/g, "").substring(0, 10);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (name === "password") {
      calculatePasswordStrength(value);
    }

    if (touchedFields[name]) {
      validateField(name, value);
    }

    if (name === "password" && touchedFields.confirm_password) {
      validateField("confirm_password", formData.confirm_password);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
      case 3:
        return "Medium";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
      case 3:
        return "bg-yellow-500";
      case 4:
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "full_name":
        if (!value.trim()) {
          error = "Full name is required";
        } else if (value.trim().length < 3) {
          error = "Full name must be at least 3 characters";
        } else if (value.trim().length > 50) {
          error = "Full name must be less than 50 characters";
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = "Full name can only contain letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (value.length > 50) {
          error = "Password must be less than 50 characters";
        }
        break;

      case "confirm_password":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "phone":
        if (!value) {
          error = "Phone number is required";
        } else if (value.length !== 10) {
          error = "Phone number must be 10 digits";
        } else if (!/^\d+$/.test(value)) {
          error = "Phone number can only contain numbers";
        }
        break;

      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
      general: "",
    }));

    return !error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
    validateField(name, value);
  };

  const validateForm = () => {
    const nameValid = validateField("full_name", formData.full_name);
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);
    const confirmPasswordValid = validateField(
      "confirm_password",
      formData.confirm_password
    );
    const phoneValid = validateField("phone", formData.phone);

    return (
      nameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      phoneValid
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouchedFields({
      full_name: true,
      email: true,
      password: true,
      confirm_password: true,
      phone: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      };

      await register(userData);
      navigate("/");
    } catch (error) {
      setFormErrors({
        ...formErrors,
        general: error.message || "Failed to register. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white transform rotate-45"></div>
          <div className="absolute top-1/4 right-1/3 w-10 h-10 border-4 border-white transform rotate-12"></div>
        </div>

        <div className="w-full h-full flex flex-col items-center justify-center z-10 text-white">
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-center mb-8">
              <i className="fas fa-tools text-6xl text-white mb-4 animate-pulse"></i>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-center">
              Welcome to Quick Gear
            </h1>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-2 flex items-center justify-center h-10 w-10 shadow-lg">
                  <i className="fas fa-search text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Find Equipment</h3>
                  <p className="text-blue-100">
                    Browse our extensive collection of high-quality rental
                    equipment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-2 flex items-center justify-center h-10 w-10 shadow-lg">
                  <i className="fas fa-calendar-check text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Book Online</h3>
                  <p className="text-blue-100">
                    Simple and secure booking process with instant confirmation
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white rounded-full p-2 flex items-center justify-center h-10 w-10 shadow-lg">
                  <i className="fas fa-truck text-blue-600"></i>
                </div>
                <div>
                  <h3 className="font-bold text-xl">Quick Delivery</h3>
                  <p className="text-blue-100">
                    Get equipment delivered right to your doorstep on time
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-blue-100">Already have an account?</p>
              <Link
                to="/login"
                className="mt-2 inline-block bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-lg"
              >
                Sign In <i className="fas fa-arrow-right ml-2"></i>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-blue-700 to-transparent opacity-30"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-300 rounded-full opacity-30"></div>
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300 rounded-full opacity-30"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center">
              <i className="fas fa-tools text-4xl text-blue-600 mb-4"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-600">
              Join Quick Gear for equipment rental services
            </p>
          </div>

          {formErrors.general && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-fadeIn">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <p>{formErrors.general}</p>
              </div>
            </div>
          )}

          <form id="signupForm" className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="full_name"
                className="block text-gray-700 font-medium mb-1"
              >
                Full Name
              </label>
              <div className="relative">
                <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-gray-50 border ${
                    formErrors.full_name ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="name"
                  placeholder="username"
                />
              </div>
              {formErrors.full_name && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.full_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-gray-50 border ${
                    formErrors.email ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="email"
                  placeholder="user@example.in"
                />
              </div>
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-1"
              >
                Phone Number
              </label>
              <div className="relative">
                <i className="fas fa-phone absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="10-digit mobile number"
                  className={`w-full bg-gray-50 border ${
                    formErrors.phone ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="tel"
                />
              </div>
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
              >
                Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-gray-50 border ${
                    formErrors.password ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="new-password"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Password strength:{" "}
                    <span className="font-medium">
                      {getPasswordStrengthText()}
                    </span>
                  </p>
                </div>
              )}
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm_password"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  id="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full bg-gray-50 border ${
                    formErrors.confirm_password
                      ? "border-red-300"
                      : "border-gray-300"
                  } pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="new-password"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>
              {formErrors.confirm_password && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.confirm_password}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    Sign Up <i className="fas fa-user-plus ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 lg:hidden">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
