import React from "react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
        </div>
        <div className="ml-3">
          <p className="text-sm">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-3">
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
