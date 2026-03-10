import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store/Index";
import { showToast } from "@/lib/utils/Toast";
import api from "@/lib/Axios";
import Modal from "@/components/ui/Modal";

import { SubjectWithClassSubjects } from "@/lib/types/SubjectTypes";
import { GetTeachers } from "@/lib/types/Teacher";

type ClassSubjectType = NonNullable<
  SubjectWithClassSubjects["classSubjects"]
>[0];

interface ChangeTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClassSubject: ClassSubjectType | null;
  onSuccess: (
    teacherId: string,
    newTeacherData: GetTeachers | null,
  ) => Promise<void>;
}

export function ChangeTeacherModal({
  isOpen,
  onClose,
  selectedClassSubject,
  onSuccess,
}: ChangeTeacherModalProps) {
  const assignTeachers = useSelector(
    (state: RootState) => state.teacher.assignTeachers,
  );
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedClassSubject) {
      setSelectedTeacher(selectedClassSubject.teacher?.id || "");
    }
  }, [isOpen, selectedClassSubject]);

  const handleChangeTeacher = async () => {
    if (!selectedClassSubject || !selectedTeacher) return;

    setLoading(true);
    try {
      const isUnassigning = selectedTeacher === "unassigned";

      // Make direct API call to update teacher assignment
      await api.patch(`/class-subject/${selectedClassSubject.id}`, {
        teacherId: isUnassigning ? null : selectedTeacher,
      });

      const newTeacherData = isUnassigning
        ? null
        : (assignTeachers.find(t => t.id === selectedTeacher) as
            | GetTeachers
            | undefined) || null;
      const teacherName = newTeacherData
        ? `${newTeacherData.user.firstName} ${newTeacherData.user.lastName}`
        : "Teacher";

      if (isUnassigning) {
        showToast.success(
          `Class ${selectedClassSubject.class.className}-${selectedClassSubject.class.section} has been unassigned.`,
        );
      } else {
        showToast.success(
          `Teacher assigned successfully! ${teacherName} is now teaching Class ${selectedClassSubject.class.className}-${selectedClassSubject.class.section}`,
        );
      }

      await onSuccess(isUnassigning ? "" : selectedTeacher, newTeacherData);
    } catch (error) {
      // API or logical error occurred
      showToast.error("Failed to assign teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Teacher"
      description={`Select a new teacher for Class ${selectedClassSubject?.class?.className || ""}-${selectedClassSubject?.class?.section || ""}`}
      className="max-w-md w-full"
      footer={
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 w-full">
          <button
            onClick={onClose}
            type="button"
            className="cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] order-2 sm:order-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleChangeTeacher}
            disabled={loading || !selectedTeacher}
            className="btn-primary flex items-center justify-center cursor-pointer text-xs sm:text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 px-4 sm:px-6 py-2.5 sm:py-3 min-w-[130px]"
          >
            {loading ? "Changing..." : "Change Teacher"}
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Select Teacher
          </label>
          <select
            value={selectedTeacher}
            onChange={e => setSelectedTeacher(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
          >
            {!selectedClassSubject?.teacher?.id && (
              <option value="">Select a teacher</option>
            )}
            {selectedClassSubject?.teacher?.id && (
              <option
                value="unassigned"
                className="text-[var(--rose)] font-medium"
              >
                Unassigned
              </option>
            )}
            {assignTeachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user?.firstName} {teacher.user?.lastName} -{" "}
                {teacher.employeeCode}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
