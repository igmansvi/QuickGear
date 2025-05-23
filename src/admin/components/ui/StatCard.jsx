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
    <div
      className={`bg-white rounded-xl p-4 border-l-4 ${borderClass} shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${bgClass} p-3 rounded-full`}>
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
