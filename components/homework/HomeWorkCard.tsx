"use client";

import React from "react";

interface HomeworkCardProps {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: "active" | "completed" | "overdue";
  color: "blue" | "green" | "amber" | "rose" | "indigo";
  onView: () => void;
}

const colorClasses = {
  blue: {
    bg: "bg-[#f8faff]",
    badge: "bg-[#3d6cf4] text-white",
    border: "border-[#3d6cf4]",
    progress: "bg-[#3d6cf4]",
  },
  green: {
    bg: "bg-[#f6fdf9]",
    badge: "bg-[#12a47e] text-white",
    border: "border-[#12a47e]",
    progress: "bg-[#12a47e]",
  },
  amber: {
    bg: "bg-[#fffdf7]",
    badge: "bg-[#e08c17] text-white",
    border: "border-[#e08c17]",
    progress: "bg-[#e08c17]",
  },
  rose: {
    bg: "bg-[#fef7f7]",
    badge: "bg-[#e83b6a] text-white",
    border: "border-[#e83b6a]",
    progress: "bg-[#e83b6a]",
  },
  indigo: {
    bg: "bg-[#faf5ff]",
    badge: "bg-[#6c47f5] text-white",
    border: "border-[#6c47f5]",
    progress: "bg-[#6c47f5]",
  },
};

export const HomeworkCard: React.FC<HomeworkCardProps> = ({
  title,
  subject,
  class: cls,
  teacher,
  dueDate,
  submitted,
  total,
  status,
  color,
  onView,
}) => {
  const colors = colorClasses[color];
  const submissionRate = Math.round((submitted / total) * 100);

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return "bg-[#12a47e] text-white";
      case "overdue":
        return "bg-[#e83b6a] text-white";
      default:
        return "bg-[#3d6cf4] text-white";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{subject}</p>
            <p className="text-sm text-gray-500">
              Class {cls} • {teacher}
            </p>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge()}`}
          >
            {status === "completed"
              ? "Completed"
              : status === "overdue"
                ? "Overdue"
                : "Active"}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Submission Progress
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {submissionRate}% ({submitted}/{total})
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${colors.progress}`}
              style={{ width: `${submissionRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
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
            Due: {dueDate}
          </div>
          <button
            onClick={onView}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
