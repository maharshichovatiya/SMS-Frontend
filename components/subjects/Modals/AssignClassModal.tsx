import React from "react";
import Modal from "@/components/ui/Modal";
import { Class } from "@/lib/api/Class";
import { GetTeachers } from "@/lib/types/Teacher";
import { SubjectWithClasses } from "@/lib/api/Subject";

interface AssignClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalLoading: boolean;
  allClasses: Class[];
  allTeachers: GetTeachers[];
  selectedSubjectId: string;
  selectedClassId: string;
  selectedTeacherId: string;
  setSelectedClassId: (id: string) => void;
  setSelectedTeacherId: (id: string) => void;
  onAssign: () => void;
  subjects: SubjectWithClasses[];
}

export function AssignClassModal({
  isOpen,
  onClose,
  modalLoading,
  allClasses,
  allTeachers,
  selectedSubjectId,
  selectedClassId,
  selectedTeacherId,
  setSelectedClassId,
  setSelectedTeacherId,
  onAssign,
  subjects,
}: AssignClassModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Class to Subject"
      description={`Assign a class and teacher to ${subjects.find(s => s.id === selectedSubjectId)?.subjectName}`}
    >
      <div className="w-full max-w-[600px] sm:w-[600px]">
        {modalLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-[var(--text-3)] ml-2">
              Loading data...
            </span>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                Subject
              </label>
              <div className="px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)]">
                {subjects.find(s => s.id === selectedSubjectId)?.subjectName ||
                  "Loading..."}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                Select Class
                <span className="text-[var(--rose)] ml-0.5">*</span>
              </label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
              >
                <option value="">Choose a class...</option>
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.className}-{cls.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                Select Teacher
                <span className="text-[var(--rose)] ml-0.5">*</span>
              </label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
              >
                <option value="">Choose a teacher...</option>
                {allTeachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.user.firstName} {teacher.user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] order-2 sm:order-1"
                style={{ height: "44px sm:52px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onAssign}
                disabled={!selectedClassId || !selectedTeacherId}
                className="btn-primary cursor-pointer text-xs sm:text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 px-4 sm:px-6 py-2.5 sm:py-3"
              >
                Assign
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
