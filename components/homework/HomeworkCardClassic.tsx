"use client";

import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";

interface HomeworkCardClassicProps {
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
  isModalOpen?: boolean;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStudentAssignment: () => void;
}

export const HomeworkCardClassic: React.FC<HomeworkCardClassicProps> = ({
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
  isModalOpen = false,
  onViewDetails,
  onEdit,
  onDelete,
  onStudentAssignment,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
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

  const getDueDateColor = () => {
    const due = new Date(dueDate);
    const today = new Date();

    const daysUntilDue = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilDue < 0) return "text-red-600";
    if (daysUntilDue <= 2) return "text-orange-600";
    return "text-gray-600";
  };

  return (
    <div
      data-homework-id={id}
      className={`group bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition ${
        isModalOpen ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
              {title}
            </h3>

            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1 text-gray-400" />
                <span>{subject}</span>
              </div>

              <div className="flex items-center">
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="ml-2">Class {className}</span>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1 text-xs font-medium border rounded-full ${getStatusBadge()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span>{teacher}</span>
            </div>

            <div
              className={`flex items-center text-sm font-medium ${getDueDateColor()}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Submissions</span>
            <span className="text-sm font-semibold text-gray-900">
              {submitted}/{total}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-1">
            <button
              onClick={onViewDetails}
              className="p-2 text-blue-600 rounded-lg"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={onEdit}
              className="p-2 text-green-600 rounded-lg"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              onClick={onDelete}
              className="p-2 text-red-600 rounded-lg"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onStudentAssignment}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg"
          >
            <Users className="w-4 h-4" />
            <span>Students</span>
          </button>
        </div>
      </div>
    </div>
  );
};
