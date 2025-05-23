import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  useEffect(() => {
    const savedEmail = localStorage.getItem("quickGearUserEmail");
    if (savedEmail) {
      setFormData((prevData) => ({ ...prevData, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from);
      }
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setFormData({
        ...formData,
        [name]: value.trim().toLowerCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (touchedFields[name]) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
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
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouchedFields({
      email: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);

      if (rememberMe) {
        localStorage.setItem("quickGearUserEmail", formData.email);
      } else {
        localStorage.removeItem("quickGearUserEmail");
      }
    } catch (error) {
      setFormErrors({
        ...formErrors,
        general:
          error.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <div className="font-sans m-0 p-0 box-border bg-gray-100 min-h-screen flex items-center justify-center">
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 transition duration-300 hover:shadow-2xl hover:shadow-blue-300">
          <div className="text-center mb-8">
            <i className="fas fa-tools text-4xl text-blue-600 mb-4"></i>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-600">
              Login to access your Quick Gear account
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

          {location.state?.timeout && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg animate-fadeIn">
              <div className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <p>Your session has expired. Please login again.</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border ${
                    formErrors.email ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="email"
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
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-gray-50 border ${
                    formErrors.password ? "border-red-300" : "border-gray-300"
                  } pl-10 pr-12 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                  autoComplete="current-password"
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
              {formErrors.password && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  name="remember-me"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "transform hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    Sign In <i className="fas fa-sign-in-alt ml-2"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
