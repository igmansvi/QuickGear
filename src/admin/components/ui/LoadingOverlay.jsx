import React, { useState, useEffect } from "react";

const LoadingOverlay = ({ message = "Loading..." }) => {
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

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

        {showTimeoutMessage && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-orange-600 text-sm mb-2">
              This is taking longer than expected.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
