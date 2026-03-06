"use client";

import { BookOpen, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { ClassItem } from "@/lib/types/Class";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cls: ClassItem;
  teacherName: string;
  teacherInitials: string;
  level: string;
  academicYear: string;
  subjectCount: number;
  teacherCount: number;
  availableSeats: number;
  onShowStudents: () => void;
}

export default function ClassDetailModal({
  isOpen,
  onClose,
  cls,
  teacherName,
  teacherInitials,
  level,
  academicYear,
  subjectCount,
  teacherCount,
  onShowStudents,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Class ${cls.className} — Section ${cls.section}`}
      description={`${level} · ${academicYear} · ${cls.status}`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Students", value: cls.studentCount ?? 0 },
            { label: "Subjects", value: subjectCount },
            { label: "Teachers", value: teacherCount },
            { label: "Capacity", value: cls.studentCapacity },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center rounded-[var(--radius-sm)] py-3 px-2 bg-[var(--bg-2)] border border-[var(--border)]"
            >
              <p className="text-2xl font-extrabold leading-none text-[var(--blue)]">
                {stat.value}
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-2)] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onShowStudents}
          className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition text-sm font-semibold"
        >
          <Users size={14} />
          Show Students
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[var(--bg-2)] border border-[var(--border)] font-bold">
            {cls.studentCount ?? 0}
          </span>
        </button>

        <div>
          <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider mb-1.5">
            Class Teacher
          </p>
          <div className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[var(--text-inverse)] shrink-0"
              style={{ background: "var(--grad-primary)" }}
            >
              {teacherInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)] capitalize">
                {teacherName}
              </p>
              {cls.classTeacher && (
                <p className="text-xs text-[var(--text-2)] mt-0.5">
                  {cls.classTeacher.designation} ·{" "}
                  {cls.classTeacher.employeeCode}
                </p>
              )}
            </div>
          </div>
        </div>

        {cls.classSubjects && cls.classSubjects.length > 0 && (
          <div>
            <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider mb-1.5">
              Subjects & Teachers ({cls.classSubjects.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {cls.classSubjects.map(cs => {
                const subTeacher = cs.teacher?.user
                  ? `${cs.teacher.user.firstName} ${cs.teacher.user.lastName}`
                  : (cs.teacher?.employeeCode ?? "No teacher assigned");
                const subTeacherInitials = cs.teacher?.user
                  ? `${cs.teacher.user.firstName?.charAt(0)}${cs.teacher.user.lastName?.charAt(0)}`
                  : "?";
                return (
                  <div
                    key={cs.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                        style={{ background: "var(--blue-light)" }}
                      >
                        <BookOpen size={12} style={{ color: "var(--blue)" }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text)] truncate">
                          {cs.subject.subjectName}
                        </p>
                        <p className="text-xs text-[var(--text-2)] font-medium">
                          {cs.subject.subjectCode}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-[var(--text-inverse)]"
                        style={{ background: "var(--grad-primary)" }}
                      >
                        {subTeacherInitials}
                      </div>
                      <span className="text-xs text-[var(--text)] capitalize font-medium hidden sm:block">
                        {subTeacher}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
