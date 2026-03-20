"use client";

import React from "react";
import { Eye, Edit, Trash2, Calendar, BookOpen, Users } from "lucide-react";

interface HomeworkCardClassicProps {
  id: string;
  title: string;
  subject: string;
  className?: string;
  teacher?: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: "active" | "completed" | "overdue" | "draft";
  description?: string;
  chapterName?: string;
  chapterNo?: number;
  isModalOpen?: boolean;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStudentAssignment: () => void;
  showActions?: boolean;
}

export const HomeworkCardClassic: React.FC<HomeworkCardClassicProps> = ({
  id,
  title,
  subject,
  dueDate,
  submitted,
  total,
  status,
  description,
  chapterName,
  chapterNo,
  isModalOpen = false,
  onViewDetails,
  onEdit,
  onDelete,
  onStudentAssignment,
  showActions = true,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return "bg-[var(--green-light)] text-[var(--green)] border border-[var(--green)]/20";
      case "overdue":
        return "bg-[var(--rose-light)] text-[var(--rose)] border border-[var(--rose)]/20";
      case "draft":
        return "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]";
      default:
        return "bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)]/20";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "overdue":
        return "Overdue";
      case "draft":
        return "Draft";
      default:
        return "Active";
    }
  };

  return (
    <div
      data-homework-id={id}
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden ${
        isModalOpen ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[17px] font-bold text-[var(--text)] mb-1 truncate">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
              <BookOpen className="w-4 h-4 text-[var(--indigo)]" />
              <span className="font-medium">{subject}</span>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusBadge()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="p-[18px]">
        {description && (
          <p className="text-sm text-[var(--text-2)] mb-4 line-clamp-2">
            {description}
          </p>
        )}

        {(chapterNo || chapterName) && (
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="px-2 py-0.5 rounded-md bg-[var(--amber-light)] text-[var(--amber)] text-xs font-semibold">
              {chapterNo && `Ch ${chapterNo}`}
              {chapterName && `: ${chapterName}`}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-[var(--text-2)] mb-4">
          <Calendar className="w-4 h-4 text-[var(--rose)]" />
          <span>Due: {dueDate}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-1">
            <button
              onClick={onViewDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--blue)] bg-[var(--blue-light)] rounded-lg"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            {showActions && (
              <button
                onClick={onStudentAssignment}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[var(--indigo)] bg-[var(--indigo-light)] rounded-lg"
              >
                <Users className="w-4 h-4" />
                Students
              </button>
            )}
          </div>

          {showActions && (
            <div className="flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-2 text-[var(--text-2)] rounded-lg hover:bg-[var(--surface-2)] hover:text-[var(--green)] transition-colors"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-[var(--text-2)] rounded-lg hover:bg-[var(--surface-2)] hover:text-[var(--rose)] transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
