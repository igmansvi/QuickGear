import React from "react";

const LoadingOverlay = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center animate-fadeIn max-w-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 mb-6">
          <div className="w-20 h-20 border-4 border-blue-100 rounded-full absolute"></div>
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 m-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <i className="fas fa-bolt text-blue-500"></i>
          </div>
        </div>

        <p className="text-gray-800 font-semibold text-center relative z-10">
          {message}
        </p>
        <div className="mt-4 text-blue-500 text-xs relative z-10">
          <span className="inline-block animate-pulse">●</span>
          <span className="inline-block animate-pulse delay-100 mx-1">●</span>
          <span className="inline-block animate-pulse delay-200">●</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
