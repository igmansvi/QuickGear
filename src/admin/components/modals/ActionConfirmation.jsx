import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const ActionConfirmation = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  icon = "exclamation-triangle",
  isOpen,
  onClose,
  onConfirm,
  data,
}) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={title}
      message={message}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={() => onConfirm(data)}
      onCancel={onClose}
      type={type}
      icon={icon}
    />
  );
};

export default ActionConfirmation;
