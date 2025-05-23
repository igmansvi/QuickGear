import React from "react";

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md relative overflow-hidden animate-pulse">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>

      <div className="flex justify-between items-center">
        <div className="w-3/4">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="bg-gray-200 p-4 rounded-full h-14 w-14"></div>
      </div>

      <div className="w-16 h-16 absolute -right-4 -bottom-4 rounded-full bg-gray-100 opacity-50"></div>
    </div>
  );
};

export default StatCardSkeleton;
