import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../services/apiService";

const RentForm = ({ productId, onSuccess, onError }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    start_date: "",
    end_date: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [dateRange, setDateRange] = useState({ minDays: 1, maxDays: 30 });

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 60);

  useEffect(() => {
    if (user) {
      const initialErrors = {};
      if (!user.full_name) initialErrors.full_name = "Full name is required";
      if (!user.email) initialErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(user.email))
        initialErrors.email = "Invalid email address";
      if (!user.phone) initialErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(user.phone?.replace(/[^0-9]/g, "")))
        initialErrors.phone = "Phone number must be 10 digits";

      setErrors(initialErrors);
    }
  }, [user]);

  const formatDateForInput = (date) => {
    return date.toISOString().split("T")[0];
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "full_name":
        if (!value.trim()) error = "Full name is required";
        else if (value.trim().length < 3)
          error = "Name must be at least 3 characters";
        break;

      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email address";
        break;

      case "phone":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\d{10}$/.test(value.replace(/[^0-9]/g, "")))
          error = "Phone number must be 10 digits";
        break;

      case "start_date":
        if (!value) error = "Start date is required";
        else {
          const startDate = new Date(value);
          const todayDate = new Date(formatDateForInput(today));
          if (startDate < todayDate) error = "Start date cannot be in the past";
        }
        break;

      case "end_date":
        if (!value) error = "End date is required";
        else if (formData.start_date) {
          const startDate = new Date(formData.start_date);
          const endDate = new Date(value);

          if (endDate < startDate)
            error = "End date cannot be before start date";

          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          if (diffDays < dateRange.minDays)
            error = `Minimum rental period is ${dateRange.minDays} day${
              dateRange.minDays > 1 ? "s" : ""
            }`;
          else if (diffDays > dateRange.maxDays)
            error = `Maximum rental period is ${dateRange.maxDays} days`;
        }
        break;

      case "message":
        if (value.length > 500) error = "Message cannot exceed 500 characters";
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

    if (name === "phone") {
      let formattedValue = value.replace(/[^0-9]/g, "");
      if (formattedValue.length > 10) {
        formattedValue = formattedValue.substring(0, 10);
      }
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

    if (touchedFields[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrors({ ...errors, [name]: error });
      } else if (errors[name]) {
        const { [name]: _, ...restErrors } = errors;
        setErrors(restErrors);
      }
    }

    if (name === "start_date" && value) {
      document.getElementById("end_date").min = value;

      if (formData.end_date) {
        const endDateError = validateField("end_date", formData.end_date);
        if (endDateError) {
          setErrors({ ...errors, end_date: endDateError });
        } else if (errors.end_date) {
          const { end_date: _, ...restErrors } = errors;
          setErrors(restErrors);
        }
      }
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
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user || !user.id) {
        throw new Error("You need to be logged in to submit a rental request.");
      }

      const bookingData = {
        user_id: user.id,
        product_id: productId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        start_date: formData.start_date,
        end_date: formData.end_date,
        message: formData.message || "",
      };

      const newBooking = await ApiService.bookings.create(bookingData);
      console.log("Booking created:", newBooking);

      onSuccess();
    } catch (error) {
      console.error("Error creating booking:", error);
      onError(
        error.message || "Failed to submit rental request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return null;

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return null;

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  const rentalDays = calculateDays();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="user_id" value={user?.id} />

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border ${
            errors.full_name ? "border-red-500" : "border-gray-300"
          } rounded-lg ${
            user?.full_name ? "bg-gray-100" : ""
          } focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
          readOnly={!!user?.full_name}
        />
        {errors.full_name && (
          <div className="text-red-500 text-sm mt-1">{errors.full_name}</div>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border ${
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-lg ${
            user?.email ? "bg-gray-100" : ""
          } focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
          readOnly={!!user?.email}
        />
        {errors.email && (
          <div className="text-red-500 text-sm mt-1">{errors.email}</div>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="10-digit phone number"
          className={`w-full px-3 py-2 border ${
            errors.phone ? "border-red-500" : "border-gray-300"
          } rounded-lg ${
            user?.phone ? "bg-gray-100" : ""
          } focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
          readOnly={!!user?.phone}
        />
        {errors.phone && (
          <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            min={formatDateForInput(today)}
            max={formatDateForInput(maxDate)}
            value={formData.start_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${
              errors.start_date ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
          />
          {errors.start_date && (
            <div className="text-red-500 text-sm mt-1">{errors.start_date}</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            End Date
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            min={formData.start_date || formatDateForInput(today)}
            max={formatDateForInput(maxDate)}
            value={formData.end_date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border ${
              errors.end_date ? "border-red-500" : "border-gray-300"
            } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
          />
          {errors.end_date && (
            <div className="text-red-500 text-sm mt-1">{errors.end_date}</div>
          )}
        </div>
      </div>

      {rentalDays && (
        <div className="bg-blue-50 p-2 rounded text-blue-700 text-sm flex items-center">
          <i className="fas fa-calendar-day mr-2"></i>
          <span>
            Rental Duration:{" "}
            <strong>
              {rentalDays} day{rentalDays > 1 ? "s" : ""}
            </strong>
          </span>
        </div>
      )}

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-1">
          Additional Message{" "}
          <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <textarea
          name="message"
          rows="3"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength="500"
          className={`w-full px-3 py-2 border ${
            errors.message ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none`}
          placeholder="Any special requirements?"
        ></textarea>
        <div className="flex justify-between items-center mt-1">
          {errors.message && (
            <div className="text-red-500 text-sm">{errors.message}</div>
          )}
          <span className="text-xs text-gray-500 ml-auto">
            {formData.message.length}/500
          </span>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-300 ${
            isSubmitting || Object.keys(errors).length > 0
              ? "opacity-70 cursor-not-allowed"
              : "transform hover:-translate-y-0.5"
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block animate-spin mr-2">⟳</span>{" "}
              Submitting...
            </>
          ) : (
            "Submit Request"
          )}
        </button>
      </div>
    </form>
  );
};

export default RentForm;