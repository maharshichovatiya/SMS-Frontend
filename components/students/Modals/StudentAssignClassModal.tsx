"use client";

import Modal from "@/components/ui/Modal";
import ClassAssignmentForm from "@/components/forms/SubjectSections/ClassAssignmentForm";
import { Student } from "@/components/tables/StudentTable";

interface StudentAssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSubmitSuccess: () => void;
}

export default function StudentAssignClassModal({
  isOpen,
  onClose,
  student,
  onSubmitSuccess,
}: StudentAssignClassModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Class"
      description="Select a class and academic year for this student."
    >
      <div className="w-[500px]">
        {student && (
          <div className="mb-4 p-3 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]">
            <p className="text-sm font-semibold text-[var(--text)]">
              {student.firstName} {student.lastName}
            </p>
          </div>
        )}
        {student && (
          <ClassAssignmentForm
            studentId={student.id}
            currentClassId={student.classId}
            currentAcademicYearId={student.academicYearId}
            onSubmitSuccess={onSubmitSuccess}
            onCancel={onClose}
          />
        )}
      </div>
    </Modal>
  );
}
