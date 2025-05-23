import React from "react";

const StatCard = ({ title, value, icon, borderClass, bgClass, iconColor }) => {
  return (
    <div className={`bg-white rounded-xl shadow p-6 border-t-4 ${borderClass}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${bgClass} p-3 rounded-full`}>
          <i className={`fas ${icon} ${iconColor} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
