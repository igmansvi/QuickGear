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
    <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform group overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50 opacity-70"></div>

      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
            {value}
          </p>
        </div>
        <div
          className={`${bgClass} p-4 rounded-full shadow-inner group-hover:scale-110 transition-transform duration-300 bg-opacity-80`}
        >
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>

      <div className="w-16 h-16 absolute -right-4 -bottom-4 rounded-full bg-gradient-to-tr from-blue-100 to-transparent opacity-50"></div>
    </div>
  );
};

export default StatCard;
