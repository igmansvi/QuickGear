import React from "react";

const DateRange = ({ startDate, endDate, format = "short" }) => {
  const formatDate = (dateString, format = "medium") => {
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

      return date.toLocaleDateString(
        "en-US",
        options[format] || options.medium
      );
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString || "N/A";
    }
  };

  return (
    <div className="flex items-center">
      <span>{formatDate(startDate, format)}</span>
      <i className="fas fa-arrow-right mx-2 text-gray-400 text-xs"></i>
      <span>{formatDate(endDate, format)}</span>
    </div>
  );
};

export default DateRange;
