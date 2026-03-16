"use client";

import React from "react";
import { Eye, Edit, Trash2, Calendar, User, BookOpen } from "lucide-react";

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
  chapterName?: string;
  isModalOpen?: boolean;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStudentAssignment: () => void;
  onClassClick?: (classId: string) => void;
  assignments?: Array<{
    id: string;
    class?: {
      id: string;
      className: string;
      section: string;
      studentCapacity?: number;
      classTeacher?: {
        user: {
          firstName: string;
          lastName: string;
        };
      };
      students?: Array<{
        id: string;
        user: {
          firstName: string;
          lastName: string;
          email: string;
        };
        status?: string;
        submittedDate?: string;
      }>;
    };
  }>;
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
  chapterName,
  isModalOpen = false,
  onViewDetails,
  onEdit,
  onDelete,
  onStudentAssignment,
  onClassClick,
  assignments = [],
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
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-blue-600 mb-2 leading-tight">
              Title: {title}
            </h3>

            {description && (
              <p className="text-sm text-green-600 mb-2 line-clamp-2 leading-relaxed">
                Description: {description}
              </p>
            )}

            <div className="flex flex-col space-y-1 text-sm">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                <span className="text-purple-600 font-medium">
                  Subject Name: {subject}
                </span>
              </div>

              {chapterName && (
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                  <span className="text-orange-600 font-medium">
                    Chapter Name: {chapterName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {assignments &&
          Array.isArray(assignments) &&
          assignments.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Assigned To:
              </p>
              <div className="space-y-2">
                {assignments.map(assignment => {
                  if (assignment.class && !assignment.student) {
                    const classInfo = assignment.class;
                    return (
                      <div
                        key={assignment.id}
                        className="bg-gray-50 p-3 rounded-lg border border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Class: {classInfo.className} - {classInfo.section}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {classInfo.studentCapacity} students • Teacher:{" "}
                              {classInfo.classTeacher?.user?.firstName}{" "}
                              {classInfo.classTeacher?.user?.lastName}
                            </p>
                          </div>
                          <button
                            onClick={() => onClassClick?.(classInfo.id!)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View All Students
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (assignment.student && assignment.student.user) {
                    const student = assignment.student;
                    return (
                      <div
                        key={assignment.id}
                        className="bg-blue-50 p-3 rounded-lg border border border-blue-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">
                              Student: {student.user.firstName}{" "}
                              {student.user.lastName}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {student.user.email} • Status:{" "}
                              {assignment.status || "Active"}
                              {assignment.submittedDate && (
                                <span>
                                  Submitted:{" "}
                                  {new Date(
                                    assignment.submittedDate,
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                assignment.status === "submitted"
                                  ? "bg-green-100 text-green-800"
                                  : assignment.status === "graded"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {assignment.status === "submitted"
                                ? "Submitted"
                                : assignment.status === "graded"
                                  ? "Graded"
                                  : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
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
        </div>
      </div>
    </div>
  );
};
