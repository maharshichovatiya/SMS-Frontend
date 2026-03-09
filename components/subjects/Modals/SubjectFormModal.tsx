import React from "react";
import Modal from "@/components/ui/Modal";
import SubjectForm from "@/components/forms/SubjectForm";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";

interface SubjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSubject: SubjectWithClassSubjects | null;
  fetchSubjects: () => Promise<void>;
}

export function SubjectFormModal({
  isOpen,
  onClose,
  editingSubject,
  fetchSubjects,
}: SubjectFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSubject?.id ? "Edit Subject" : "Add Subject"}
      description={
        editingSubject?.id
          ? "Update the subject information below."
          : "Fill in the details below to create a new subject."
      }
    >
      <div className="w-[560px]">
        <SubjectForm
          initialData={editingSubject?.id ? editingSubject : undefined}
          onClose={onClose}
          onSubmitSuccess={() => {
            onClose();
            fetchSubjects();
          }}
        />
      </div>
    </Modal>
  );
}
