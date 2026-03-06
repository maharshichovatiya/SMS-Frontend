"use client";

import { ChevronLeft, GraduationCap, Hash, Mail } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { StudentAcademic } from "@/lib/types/Class";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  className: string | number;
  section: string;
  validStudents: StudentAcademic[];
  availableSeats: number;
}

export default function ClassStudentsModal({
  isOpen,
  onClose,
  onBack,
  className,
  section,
  validStudents,
  availableSeats,
}: Props) {
  const totalEnrolled = validStudents.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Students — Class ${className} · ${section}`}
      description={`${totalEnrolled} enrolled · ${availableSeats} seats available`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[var(--text-2)] hover:text-[var(--blue)] transition-colors group"
          >
            <span className="flex    items-center  justify-center w-6 h-6 rounded-full border border-[var(--border)] group-hover:border-[var(--blue)] group-hover:bg-[var(--blue-light)] transition-all">
              <ChevronLeft size={13} />
            </span>
            Back to class details
          </button>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)]/20">
              <GraduationCap size={11} />
              {totalEnrolled} enrolled
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--border)]">
              {availableSeats} seats left
            </span>
          </div>
        </div>

        <div className="h-px bg-[var(--border)]" />

        {validStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-[var(--text-3)]">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center">
              <GraduationCap size={22} className="opacity-40" />
            </div>
            <p className="text-sm font-medium">No students enrolled yet</p>
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-0.5 -mr-1"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            }}
          >
            <div className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[28px_1fr_120px_auto] gap-3 px-3 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">
                #
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)]">
                Student
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] text-right hidden sm:block">
                Admission
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-3)] text-right">
                Status
              </span>
            </div>

            {validStudents.map((sa, idx) => {
              const student = sa.student!;
              const fullName = student.user
                ? [
                    student.user.firstName,
                    student.user.middleName,
                    student.user.lastName,
                  ]
                    .filter(Boolean)
                    .join(" ")
                : "Unknown Student";

              const initials = student.user
                ? `${student.user.firstName?.charAt(0) ?? ""}${student.user.lastName?.charAt(0) ?? ""}`
                : "?";

              const rollNo = sa.rollNo ?? student.rollNo;

              return (
                <div
                  key={sa.id}
                  className="grid grid-cols-[28px_1fr_auto] sm:grid-cols-[28px_1fr_120px_auto] gap-3 items-center px-3 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-2)] hover:bg-[var(--surface)] hover:border-[var(--blue)]/30 hover:shadow-sm transition-all"
                >
                  <span className="text-xs font-bold text-[var(--text-3)] text-center tabular-nums">
                    {idx + 1}
                  </span>

                  <div className="flex items-center gap-2.5 min-w-0">
                    {student.user?.profilePhoto ? (
                      <img
                        src={student.user.profilePhoto}
                        alt={fullName}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[var(--border)]"
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-black text-[var(--text-inverse)]"
                        style={{ background: "var(--grad-primary)" }}
                      >
                        {initials.toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)] capitalize truncate leading-tight">
                        {fullName}
                      </p>
                      {student.user?.email && (
                        <p className="text-[11px] text-[var(--text-3)] truncate flex items-center gap-1 mt-0.5">
                          <Mail size={9} className="shrink-0" />
                          {student.user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right hidden sm:block shrink-0">
                    <p className="text-xs font-semibold text-[var(--text-2)] flex items-center justify-end gap-1">
                      <Hash size={9} className="text-[var(--text-3)]" />
                      {student.admissionNo}
                    </p>
                    {rollNo && (
                      <p className="text-[10px] text-[var(--text-3)] mt-0.5">
                        Roll {rollNo}
                      </p>
                    )}
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
