import React from "react";

const ErrorDisplay = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg my-4 flex items-start">
      <div className="flex-shrink-0 pt-0.5">
        <i className="fas fa-exclamation-circle text-red-500 text-xl"></i>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-red-800 font-medium">Error</h3>
        <p className="text-red-700 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-medium transition-colors duration-300"
          >
            <i className="fas fa-sync-alt mr-2"></i> Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
