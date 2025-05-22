import React from "react";
import { getStatusColor } from "../../utils/formatting";

const StatusBadge = ({ status, className = "", size = "md" }) => {
  const formatStatusText = (status) => {
    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return "check-circle";
      case "pending":
        return "clock";
      case "confirmed":
        return "thumbs-up";
      case "completed":
        return "check-double";
      case "cancelled":
        return "times-circle";
      case "rented":
        return "handshake";
      case "coming_soon":
        return "hourglass-half";
      default:
        return "question-circle";
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${className}`}
      style={{
        backgroundColor: `${getStatusColor(status)}`,
        color: "#ffffff",
      }}
    >
      <i className={`fas fa-${getStatusIcon(status)} mr-1`}></i>
      {formatStatusText(status)}
    </div>
  );
};

export default StatusBadge;
