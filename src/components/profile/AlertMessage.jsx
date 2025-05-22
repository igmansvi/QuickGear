import React, { useEffect, useState } from "react";

const AlertMessage = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getAlertClasses = () => {
    if (type === "success") {
      return {
        containerClass:
          "bg-green-50 border-l-4 border-[var(--color-completed)] text-green-700",
        iconClass: "fas fa-check-circle text-[var(--color-completed)]",
      };
    } else if (type === "error") {
      return {
        containerClass:
          "bg-red-50 border-l-4 border-[var(--color-cancelled)] text-red-700",
        iconClass: "fas fa-exclamation-circle text-[var(--color-cancelled)]",
      };
    } else {
      return {
        containerClass:
          "bg-blue-50 border-l-4 border-[var(--color-confirmed)] text-blue-700",
        iconClass: "fas fa-info-circle text-[var(--color-confirmed)]",
      };
    }
  };

  const { containerClass, iconClass } = getAlertClasses();

  if (!isVisible) return null;

  return (
    <div
      className={`${containerClass} p-4 rounded-lg animate-fadeIn shadow-sm mb-8 relative`}
    >
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <i className="fas fa-times"></i>
      </button>
      <div className="flex items-center">
        <i className={`${iconClass} mr-2 text-lg`}></i>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

export default AlertMessage;
