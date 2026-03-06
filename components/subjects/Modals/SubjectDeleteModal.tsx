import React from "react";
import Modal from "@/components/ui/Modal";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";

interface SubjectDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDeleting: boolean;
  deletingSubject: SubjectWithClassSubjects | null;
  handleDeleteSubject: () => void;
}

export function SubjectDeleteModal({
  isOpen,
  onClose,
  isDeleting,
  deletingSubject,
  handleDeleteSubject,
}: SubjectDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Subject"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteSubject}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
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
            {deletingSubject?.subjectName}
          </span>
          ? This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
}
