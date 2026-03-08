"use client";

import Modal from "@/components/ui/Modal";
import { Student } from "@/components/tables/StudentTable";

interface StudentDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function StudentDeleteModal({
  isOpen,
  onClose,
  student,
  onConfirm,
  isDeleting,
}: StudentDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Student"
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
      <div className="w-[380px] flex flex-col items-center text-center py-2">
        <p className="text-sm text-[var(--text-3)]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[var(--text)]">
            {student?.firstName} {student?.lastName}
          </span>
          ? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
