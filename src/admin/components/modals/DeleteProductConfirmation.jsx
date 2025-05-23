import React from "react";
import ConfirmationModal from "./ConfirmationModal";

const DeleteProductConfirmation = ({ product, isOpen, onClose, onConfirm }) => {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      title="Delete Product"
      message={`Are you sure you want to delete "${product?.name}"? This action cannot be undone.`}
      confirmText="Delete Product"
      cancelText="Cancel"
      onConfirm={() => onConfirm(product?.id)}
      onCancel={onClose}
      type="danger"
      icon="trash-alt"
    />
  );
};

export default DeleteProductConfirmation;
