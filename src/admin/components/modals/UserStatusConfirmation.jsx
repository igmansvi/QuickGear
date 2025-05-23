import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const UserStatusConfirmation = ({
  user,
  newStatus,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const getStatusConfig = () => {
    switch (newStatus) {
      case "active":
        return {
          title: "Activate User Account",
          message: `Are you sure you want to activate ${user?.full_name}'s account?`,
          type: "success",
          icon: "user-check",
        };
      case "suspended":
        return {
          title: "Suspend User Account",
          message: `Are you sure you want to suspend ${user?.full_name}'s account? They will not be able to make bookings while suspended.`,
          type: "warning",
          icon: "user-clock",
        };
      case "banned":
        return {
          title: "Ban User Account",
          message: `Are you sure you want to ban ${user?.full_name}'s account? This action will prevent them from using the platform.`,
          type: "danger",
          icon: "user-slash",
        };
      default:
        return {
          title: "Change User Status",
          message: `Are you sure you want to change ${user?.full_name}'s account status?`,
          type: "info",
          icon: "user-edit",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={config.title}
      message={config.message}
      confirmText="Confirm Change"
      cancelText="Cancel"
      onConfirm={() => onConfirm(user?.id, newStatus)}
      onCancel={onClose}
      type={config.type}
      icon={config.icon}
    />
  );
};

export default UserStatusConfirmation;
