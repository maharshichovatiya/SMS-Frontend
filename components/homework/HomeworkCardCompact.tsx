"use client";

import React from "react";

interface HomeworkCardCompactProps {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacher: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: "active" | "completed" | "overdue" | "draft";
  description?: string;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStudentAssignment: () => void;
}

export const HomeworkCardCompact: React.FC<HomeworkCardCompactProps> = ({
  id,
  title,
  subject,
  className,
  teacher,
  dueDate,
  submitted,
  total,
  status,
  description,
  onViewDetails,
  onEdit,
  onDelete,
  onStudentAssignment,
}) => {
  const submissionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return "bg-green-600 text-white";
      case "overdue":
        return "bg-rose-600 text-white";
      case "draft":
        return "bg-gray-600 text-white";
      default:
        return "bg-blue-600 text-white";
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
      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {title}
            </h3>

            <p className="text-sm text-gray-600">{subject}</p>

            <p className="text-xs text-gray-500">
              Class {className} • {teacher}
            </p>

            {description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">
              Submission Progress
            </span>
            <span className="text-xs font-semibold text-gray-900">
              {submissionRate}% ({submitted}/{total})
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${submissionRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-3 h-3 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Due: {new Date(dueDate).toLocaleDateString()}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onViewDetails}
            className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700"
          >
            View Details
          </button>

          <button
            onClick={onEdit}
            className="px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
          >
            Edit
          </button>

          <button
            onClick={onDelete}
            className="px-3 py-2 bg-rose-600 text-white text-xs font-medium rounded-lg hover:bg-rose-700"
          >
            Delete
          </button>

          <button
            onClick={onStudentAssignment}
            className="px-3 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700"
          >
            Students
          </button>
        </div>
      </div>
    </div>
  );
};
