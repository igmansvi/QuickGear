/**
 * Collection of utility functions for formatting data
 */

export const formatDate = (dateString, format = "medium") => {
  try {
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    const options = {
      short: { month: "short", day: "numeric" },
      medium: { month: "short", day: "numeric", year: "numeric" },
      long: {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      full: {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    };

    return date.toLocaleDateString("en-US", options[format] || options.medium);
  } catch (error) {
    console.error("Date formatting error:", error);
    return dateString || "N/A";
  }
};

export const getStatusColor = (status) => {
  const colors = {
    available: "#22c55e",
    pending: "#f59e0b",
    confirmed: "#3b82f6",
    completed: "#10b981",
    coming_soon: "#f97316",
    rented: "#ef4444",
    cancelled: "#dc2626",
  };

  return colors[status] || "#9ca3af";
};

export const getStatusColorClass = (status) => {
  const classes = {
    available: "bg-[#22c55e] text-white",
    pending: "bg-[#f59e0b] text-white",
    confirmed: "bg-[#3b82f6] text-white",
    completed: "bg-[#10b981] text-white",
    coming_soon: "bg-[#f97316] text-white",
    rented: "bg-[#ef4444] text-white",
    cancelled: "bg-[#dc2626] text-white",
  };

  return classes[status] || "bg-gray-400 text-white";
};

export const calculateTotalDays = (startDate, endDate) => {
  if (startDate === endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) return 0;

  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + 1;
};

export const formatPrice = (price, currency = "₹") => {
  if (typeof price !== "number") return "N/A";

  return `${currency}${price.toLocaleString()}`;
};

export const formatStatus = (status) => {
  if (!status) return "";
  return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
