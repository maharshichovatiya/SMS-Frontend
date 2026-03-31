"use client";

import Modal from "@/components/ui/Modal";
import { Notice } from "@/lib/types/Notice";

interface NoticeDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: Notice | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function NoticeDeleteModal({
  isOpen,
  onClose,
  notice,
  onConfirm,
  isDeleting,
}: NoticeDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Notice"
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
        <p className="text-sm text-[var(--text-3)]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--text)]">
            {notice?.title}
          </span>
          ? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
