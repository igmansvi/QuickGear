import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const UserStatusConfirmation = ({
  user,
  newStatus,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!user) return null;

  const getStatusInfo = () => {
    switch (newStatus) {
      case "banned":
        return {
          title: "Ban User",
          message: `Are you sure you want to ban ${user.full_name}'s account? This will prevent them from logging in and making bookings.`,
          type: "danger",
          icon: "user-slash",
        };
      case "suspended":
        return {
          title: "Suspend User",
          message: `Are you sure you want to suspend ${user.full_name}'s account? They will not be able to make new bookings until reinstated.`,
          type: "warning",
          icon: "user-clock",
        };
      case "active":
        return {
          title: "Activate User",
          message: `Are you sure you want to activate ${user.full_name}'s account? They will have full access to the platform.`,
          type: "success",
          icon: "user-check",
        };
      default:
        return {
          title: "Update User Status",
          message: `Are you sure you want to change ${user.full_name}'s status to ${newStatus}?`,
          type: "info",
          icon: "user-edit",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <ConfirmationModal
      title={statusInfo.title}
      message={statusInfo.message}
      type={statusInfo.type}
      icon={statusInfo.icon}
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={() => onConfirm(user.id, newStatus)}
      confirmText="Confirm"
      cancelText="Cancel"
    />
  );
};

export default UserStatusConfirmation;
