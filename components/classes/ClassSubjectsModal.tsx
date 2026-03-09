"use client";

import { BookOpen, ChevronLeft } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { ClassItem } from "@/lib/types/Class";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  className: string | number;
  section: string;
  cls: ClassItem;
}

export default function ClassSubjectsModal({
  isOpen,
  onClose,
  onBack,
  className,
  section,
  cls,
}: Props) {
  const subjects = cls.classSubjects ?? [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Subjects — Class ${className} · ${section}`}
      description={`${subjects.length} subjects assigned`}
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--blue)] transition-colors group"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full border border-[var(--border)] group-hover:border-[var(--blue)] group-hover:bg-[var(--blue-light)] transition-all">
              <ChevronLeft size={13} />
            </span>
            Back to class details
          </button>

          <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)]/20">
            <BookOpen size={11} />
            {subjects.length} subjects
          </span>
        </div>

        <div className="h-px bg-[var(--border)]" />

        {subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-[var(--text-3)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center">
              <BookOpen size={22} className="opacity-40" />
            </div>
            <p className="text-sm font-medium">No subjects assigned yet</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[420px] overflow-y-auto pr-0.5 -mr-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            }}
          >
            {subjects.map((cs, idx) => {
              const subTeacher = cs.teacher?.user
                ? `${cs.teacher.user.firstName} ${cs.teacher.user.lastName}`
                : (cs.teacher?.employeeCode ?? "No teacher assigned");

              const subTeacherInitials = cs.teacher?.user
                ? `${cs.teacher.user.firstName?.charAt(0) ?? ""}${cs.teacher.user.lastName?.charAt(0) ?? ""}`
                : "?";

              return (
                <div
                  key={cs.id}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--surface)] hover:border-[var(--blue)]/30 hover:shadow-sm transition-all min-w-0"
                >
                  <span className="text-xs font-bold text-[var(--text-3)] tabular-nums w-5 shrink-0">
                    {idx + 1}
                  </span>

                  <div
                    className="w-8 h-8 rounded-[var(--radius-sm)] shrink-0 flex items-center justify-center"
                    style={{ background: "var(--blue-light)" }}
                  >
                    <BookOpen size={14} style={{ color: "var(--blue)" }} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--text)] truncate leading-tight">
                      {cs.subject.subjectName}
                    </p>
                    <p className="text-[11px] text-[var(--text-3)] truncate mt-0.5">
                      {cs.subject.subjectCode}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-[var(--text-inverse)] shrink-0"
                      style={{ background: "var(--grad-primary)" }}
                    >
                      {subTeacherInitials.toUpperCase()}
                    </div>
                    <span className="text-xs text-[var(--text-2)] capitalize font-medium hidden sm:block truncate max-w-[80px]">
                      {subTeacher}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}
