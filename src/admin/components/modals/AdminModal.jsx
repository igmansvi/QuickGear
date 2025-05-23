import React, { useEffect, useRef } from "react";

const AdminModal = ({
  children,
  onClose,
  title,
  size = "md",
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} flex flex-col max-h-[90vh] modal-animate-in overflow-hidden transition-transform duration-300 ease-out`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>

        {title && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white flex items-center">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
              {title}
            </h3>
            <div className="w-8 h-1 ml-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
          </div>
        )}

        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 z-10 hover:shadow-lg group"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-gray-600 group-hover:text-gray-800 transition-colors"></i>
          </button>
        )}

        <div className="p-6 overflow-y-auto scrollbar-hide flex-1 relative">
          {children}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default AdminModal;
