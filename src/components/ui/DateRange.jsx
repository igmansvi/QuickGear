import React from "react";
import { formatDate } from "../../utils/formatting";

const DateRange = ({ startDate, endDate, format = "short" }) => {
  return (
    <div className="flex items-center">
      <span>{formatDate(startDate, format)}</span>
      <i className="fas fa-arrow-right mx-2 text-gray-400 text-xs"></i>
      <span>{formatDate(endDate, format)}</span>
    </div>
  );
};

export default DateRange;
