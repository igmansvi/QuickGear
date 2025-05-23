import React from "react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-white p-5 rounded-xl my-4 flex items-start shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-red-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-pattern-dots opacity-5 pointer-events-none"></div>

      <div className="flex-shrink-0 pt-0.5 mr-4">
        <div className="bg-red-100 rounded-full p-2 shadow-inner">
          <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-red-800 font-medium mb-1 flex items-center">
          <span>Error</span>
          <span className="inline-block w-12 h-0.5 ml-2 bg-red-200 rounded-full"></span>
        </h3>
        <p className="text-red-700 mb-3">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-800 px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center w-auto inline-flex"
          >
            <i className="fas fa-sync-alt mr-2 animate-spin-slow"></i> Retry
          </button>
        )}
      </div>

      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-red-100/50 pointer-events-none"></div>
    </div>
  );
};

export default ErrorDisplay;
