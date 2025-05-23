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
    <div className="admin-modal-backdrop" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`admin-modal ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="admin-modal-header">
            {title && <h3 className="admin-modal-title">{title}</h3>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="admin-modal-close-btn"
                aria-label="Close modal"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AdminModal;
