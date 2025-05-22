import React from "react";

const Faqs = () => {
  return (
    <div id="faqs" className="faqs-section bg-gray-100 py-16">
      <div className="page-container">
        <div className="section-header text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            Frequently Asked Questions
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4">Find answers to common questions</p>
        </div>
        <div className="faq-list">
          <div className="faq-item mb-6">
            <h4 className="font-bold text-gray-800">
              What is the rental process?
            </h4>
            <p className="text-gray-600">
              Browse our collection, book your desired equipment, and get it
              delivered to your location.
            </p>
          </div>
          <div className="faq-item mb-6">
            <h4 className="font-bold text-gray-800">
              What are the payment options?
            </h4>
            <p className="text-gray-600">
              We accept all major credit/debit cards, UPI, and net banking.
            </p>
          </div>
          <div className="faq-item mb-6">
            <h4 className="font-bold text-gray-800">
              Is there a security deposit?
            </h4>
            <p className="text-gray-600">
              Yes, a refundable security deposit is required for most rentals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
