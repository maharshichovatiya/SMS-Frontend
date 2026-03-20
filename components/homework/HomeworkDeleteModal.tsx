"use client";

import Modal from "@/components/ui/Modal";

interface HomeworkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTitle: string;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function HomeworkDeleteModal({
  isOpen,
  onClose,
  homeworkTitle,
  onConfirm,
  isDeleting,
}: HomeworkDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Homework"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </>
      }
    >
      <div className="w-[380px] py-4 text-center">
        <p className="text-sm text-[var(--text-3)] mb-2">
          Are you sure you want to delete this homework?
        </p>
        <span className="block px-4 py-2 mt-4 text-sm font-semibold text-[var(--rose)] bg-[var(--rose-light)] rounded border border-[var(--rose-muted)] mb-2">
          {homeworkTitle}
        </span>
        <p className="text-sm text-[var(--text-3)] mt-4">
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
