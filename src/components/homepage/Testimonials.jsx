import React, { useRef } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";

const Testimonials = () => {
  const testimonialsRef = useRef(null);

  useIntersectionObserver(testimonialsRef, { threshold: 0.2 });

  return (
    <div
      className="testimonials-section bg-gray-50 py-16"
      ref={testimonialsRef}
    >
      <div className="page-container">
        <div className="section-header text-center mb-12 lazy-load is-visible">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative inline-block">
            What Our Customers Say
            <span className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-600 to-blue-500 rounded"></span>
          </h2>
          <p className="text-gray-600 mt-4">Hear from our happy customers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="testimonial lazy-load bg-white p-6 rounded-xl shadow-md relative transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                className="text-blue-100"
              >
                <path
                  d="M12 6.76v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1zm0 12.5v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-gray-600 italic mb-6 relative z-10">
              "Quick Gear made my event planning so much easier. The equipment
              was top-notch and delivered on time!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                PS
              </div>
              <h4 className="font-bold text-gray-800">Priya Sharma</h4>
            </div>
          </div>

          <div className="testimonial lazy-load bg-white p-6 rounded-xl shadow-md relative transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                className="text-blue-100"
              >
                <path
                  d="M12 6.76v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1zm0 12.5v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-gray-600 italic mb-6 relative z-10">
              "I rented a DSLR camera for my vacation. The process was seamless,
              and the camera worked perfectly."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                K
              </div>
              <h4 className="font-bold text-gray-800">Kiran</h4>
            </div>
          </div>

          <div className="testimonial lazy-load bg-white p-6 rounded-xl shadow-md relative transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                className="text-blue-100"
              >
                <path
                  d="M12 6.76v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1zm0 12.5v6.5a1 1 0 0 0 1 1h6.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H13a1 1 0 0 0-1 1z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <p className="text-gray-600 italic mb-6 relative z-10">
              "Affordable prices and excellent customer service. Highly
              recommend Quick Gear for any rental needs."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3">
                VJ
              </div>
              <h4 className="font-bold text-gray-800">Varun Jamwal</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
