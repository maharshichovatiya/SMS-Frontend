"use client";

import React from "react";

interface StudentFormActionsProps {
  isSubmitting: boolean;
  fetchingData: boolean;
  isEditMode: boolean;
  hasChanges: boolean;
  onCancel: () => void;
}

export default function StudentFormActions({
  isSubmitting,
  fetchingData,
  isEditMode,
  hasChanges,
  onCancel,
}: StudentFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 cursor-pointer py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-[52px]"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || fetchingData || (isEditMode && !hasChanges)}
        className={`btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] ${
          isSubmitting || fetchingData || (isEditMode && !hasChanges)
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        {isSubmitting
          ? "Saving..."
          : isEditMode
            ? "Update Student"
            : "Admit Student"}
      </button>
    </div>
  );
}
