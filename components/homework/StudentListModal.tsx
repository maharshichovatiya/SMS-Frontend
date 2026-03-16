"use client";

import React from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  className: string;
  section: string;
  status: "submitted" | "pending" | "overdue" | "graded";
  submittedDate?: string;
  grade?: number;
  feedback?: string;
}

interface StudentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTitle: string;
  students: Student[];
}

export const StudentListModal: React.FC<StudentListModalProps> = ({
  isOpen,
  onClose,
  homeworkTitle,
  students,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "graded":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalStudents = students.length;
  const submittedCount = students.filter(
    s => s.status === "submitted" || s.status === "graded",
  ).length;
  const pendingCount = students.filter(s => s.status === "pending").length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {homeworkTitle}
              </h2>
              <p className="text-gray-600 mt-1">Assigned Students List</p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {totalStudents}
              </p>
              <p className="text-sm text-gray-600">Total Students</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {submittedCount}
              </p>
              <p className="text-sm text-gray-600">Submitted</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {pendingCount}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search students by name, email, or class..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-280px)]">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm
                  ? "No students found matching your search."
                  : "No students assigned to this homework."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <div
                  key={student.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">
                          {student.className}{" "}
                          {student.section && `- ${student.section}`}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          student.status,
                        )}`}
                      >
                        {student.status === "submitted"
                          ? "Submitted"
                          : student.status === "graded"
                            ? "Graded"
                            : student.status === "overdue"
                              ? "Overdue"
                              : "Pending"}
                      </span>
                      {student.submittedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted:{" "}
                          {new Date(student.submittedDate).toLocaleDateString()}
                        </p>
                      )}
                      {student.grade !== undefined && (
                        <p className="text-xs font-medium text-gray-700 mt-1">
                          Grade: {student.grade}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
