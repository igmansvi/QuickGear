import React from "react";
import AdminModal from "./AdminModal";

const ConfirmationModal = ({
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
  icon = "exclamation-triangle",
  isOpen = false,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          bg: "from-red-50 to-red-100",
          text: "text-red-600",
          iconBg: "bg-red-100",
          confirmButton:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
        };
      case "success":
        return {
          bg: "from-green-50 to-green-100",
          text: "text-green-600",
          iconBg: "bg-green-100",
          confirmButton:
            "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800",
        };
      case "info":
        return {
          bg: "from-blue-50 to-blue-100",
          text: "text-blue-600",
          iconBg: "bg-blue-100",
          confirmButton:
            "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
        };
      case "warning":
      default:
        return {
          bg: "from-yellow-50 to-yellow-100",
          text: "text-yellow-600",
          iconBg: "bg-yellow-100",
          confirmButton:
            "bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800",
        };
    }
  };

  const styles = getTypeStyles();

  if (!isOpen) return null;

  return (
    <AdminModal onClose={onCancel} size="sm" showCloseButton={false}>
      <div className="text-center mb-6">
        <div
          className={`mx-auto rounded-full bg-gradient-to-r ${styles.bg} w-20 h-20 flex items-center justify-center mb-4 shadow-inner`}
        >
          <i className={`fas fa-${icon} ${styles.text} text-3xl`}></i>
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{message}</p>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          onClick={onCancel}
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2.5 px-5 rounded-lg transition-colors duration-300 border border-gray-300 shadow-sm hover:shadow flex items-center"
        >
          <i className="fas fa-times mr-2"></i> {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`${styles.confirmButton} text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center`}
        >
          <i className="fas fa-check mr-2"></i> {confirmText}
        </button>
      </div>
    </AdminModal>
  );
};

export default ConfirmationModal;
