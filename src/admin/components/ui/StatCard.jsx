import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  bgClass = "bg-blue-100",
  iconColor = "text-blue-500",
  borderClass = "border-blue-500",
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 transform group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-70"></div>
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1 group-hover:text-blue-700 transition-colors duration-300">
            {value}
          </p>
        </div>
        <div
          className={`${bgClass} p-3 rounded-full shadow-inner group-hover:scale-110 transition-transform duration-300`}
        >
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
