import React from "react";
import ConfirmationModal from "./ConfirmationModal";
import AdminApiService from "../../api/AdminApiService";

const UserStatusConfirmation = ({
  user,
  newStatus,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!user) return null;

  const confirmationDetails = AdminApiService.utils.getConfirmationDetails(
    "changeUserStatus",
    { status: newStatus }
  );

  return (
    <ConfirmationModal
      isOpen={isOpen}
      title={confirmationDetails.title}
      message={confirmationDetails.message.replace("this user", user.full_name)}
      confirmText={confirmationDetails.confirmText}
      cancelText={confirmationDetails.cancelText}
      onConfirm={() => onConfirm(user.id, newStatus)}
      onCancel={onClose}
      type={confirmationDetails.type}
      icon={confirmationDetails.icon}
    />
  );
};

export default UserStatusConfirmation;
