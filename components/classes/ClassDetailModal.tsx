"use client";

import { BookOpen, Briefcase, Mail, Phone, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { ClassItem } from "@/lib/types/Class";
import { formatExperience } from "@/lib/utils/TotalExpMonths";

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
  onShowSubjects: () => void;
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
  onShowSubjects,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Class ${cls.className} — Section ${cls.section}`}
      description={`${level} · ${academicYear} · ${cls.status}`}
      className="max-w-2xl"
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

        <div className="grid grid-cols-2 gap-2">
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

          <button
            onClick={onShowSubjects}
            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition text-sm font-semibold"
          >
            <BookOpen size={14} />
            Show Subjects
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[var(--bg-2)] border border-[var(--border)] font-bold">
              {subjectCount}
            </span>
          </button>
        </div>

        <div>
          <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider mb-1.5">
            Class Teacher
          </p>
          <div className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-[var(--text-inverse)] shrink-0"
              style={{ background: "var(--grad-primary)" }}
            >
              {teacherInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)] capitalize">
                {teacherName}
              </p>
              {cls.classTeacher && (
                <p className="text-xs text-[var(--text-2)] mt-0.5">
                  {cls.classTeacher.designation} ·{" "}
                  {cls.classTeacher.employeeCode}
                </p>
              )}
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {cls.classTeacher?.user?.phone && (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-3)]">
                    <Phone size={10} className="shrink-0" />
                    {cls.classTeacher.user.phone}
                  </span>
                )}
                {cls.classTeacher?.user?.email && (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-3)] truncate">
                    <Mail size={10} className="shrink-0" />
                    {cls.classTeacher.user.email}
                  </span>
                )}
                {cls.classTeacher?.totalExpMonths != null && (
                  <span className="flex items-center gap-1 text-[11px] text-[var(--text-3)]">
                    <Briefcase size={10} className="shrink-0" />
                    {formatExperience(cls.classTeacher.totalExpMonths)} exp
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
