import React from "react";

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center animate-fadeIn max-w-sm">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full absolute"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
        <div className="mt-4 text-blue-500 text-xs animate-pulse">
          Please wait...
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
