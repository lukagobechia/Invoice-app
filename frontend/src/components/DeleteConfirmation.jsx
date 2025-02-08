import React from "react";
import "../styles/DeleteConfirmation.css";

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  itemType = "item",
}) {
  if (!isOpen) return null;

  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-modal">
        <h2 className="delete-confirmation-title">Confirm Deletion</h2>
        <p className="delete-confirmation-message">
          {`Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
        </p>
        <div className="delete-confirmation-actions">
          <button onClick={onClose} className="button button-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="button button-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
