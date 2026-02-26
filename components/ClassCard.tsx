"use client";

import { Pencil, Trash2 } from "lucide-react";

export interface ClassItem {
  id: string;
  class_name: string;
  section: string;
  class_teacher_id: string;
  student_capacity: number;
  status: string;
  teacher: string;
  subjects: { label: string; color: string }[];
  students: number;
  subjects_count: number;
  teachers: number;
}

const STAT_COLORS = [
  "text-[var(--blue)]",
  "text-[var(--green)]",
  "text-[var(--amber)]",
];

interface ClassCardProps {
  cls: ClassItem;
  onEdit?: (cls: ClassItem) => void;
  onDelete?: (cls: ClassItem) => void;
}

export default function ClassCard({ cls, onEdit, onDelete }: ClassCardProps) {
  const stats = [
    { value: cls.students, label: "STUDENTS" },
    { value: cls.subjects_count, label: "SUBJECTS" },
    { value: cls.teachers, label: "TEACHERS" },
  ];

  return (
    <div
      className="bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] p-5 flex flex-col gap-4"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      <div className="flex items-start justify-between">
        <h2 className="text-3xl font-black leading-none text-[var(--blue)]">
          {cls.class_name}
        </h2>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--indigo-light)] text-[var(--indigo)]">
          {cls.status}
        </span>
      </div>

      <div>
        <p className="text-sm font-bold text-[var(--text)]">
          Section {cls.section}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-base">🏫</span>
          <p className="text-sm text-[var(--text-2)]">{cls.teacher}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {cls.subjects.map(s => (
          <span
            key={s.label}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}
          >
            {s.label}
          </span>
        ))}
      </div>

      <div className="border-t border-[var(--border)]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <p
                className={`text-xl font-black leading-none ${STAT_COLORS[i]}`}
              >
                {stat.value}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-[var(--text-3)] mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit?.(cls)}
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--text-3)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition-colors duration-[var(--duration)]"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete?.(cls)}
            className="w-8 h-8 flex items-center justify-center rounded-[var(--radius-xs)] text-[var(--text-3)] hover:text-[var(--rose)] hover:bg-[var(--rose-light)] transition-colors duration-[var(--duration)]"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
