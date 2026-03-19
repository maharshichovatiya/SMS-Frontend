"use client";

import { Pencil } from "lucide-react";
import { Student } from "./StudentTable";

interface StudentTableActionsSimpleProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
}

export default function StudentTableActionsSimple({
  student,
  onView,
  onEdit,
}: StudentTableActionsSimpleProps) {
  return (
    <>
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(student)}
            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--surface-2)] text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--border)]"
            title="View Details"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(student)}
            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
            title="Edit"
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
        </div>
      </td>
    </>
  );
}
