import React from "react";

const StatCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-t-4 border-gray-200 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-3/4">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="bg-gray-200 p-3 rounded-full h-12 w-12"></div>
      </div>
    </div>
  );
};

export default StatCardSkeleton;
