import React from "react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-white p-4 rounded-lg my-4 flex items-start shadow-md">
      <div className="flex-shrink-0 pt-0.5">
        <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 bg-gradient-to-r from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 text-red-800 px-4 py-2 rounded-lg font-medium transition-colors duration-300 shadow-sm hover:shadow"
          >
            <i className="fas fa-sync-alt mr-2"></i> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
