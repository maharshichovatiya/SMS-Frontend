"use client";

import React, { useState } from "react";

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

interface StudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeworkTitle: string;
  homeworkId: string;
  students: Student[];
  onAssignStudents: (studentIds: string[]) => void;
  onGradeStudent: (studentId: string, grade: number, feedback: string) => void;
}

export const StudentAssignmentModal: React.FC<StudentAssignmentModalProps> = ({
  isOpen,
  onClose,
  homeworkTitle,
  students,
  onAssignStudents,
}) => {
  const [activeTab, setActiveTab] = useState<"assign" | "statistics">("assign");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const totalStudents = students.length;

  const submittedCount = students.filter(
    s => s.status === "submitted" || s.status === "graded",
  ).length;

  const gradedStudents = students.filter(s => s.grade !== undefined);

  const averageGrade =
    gradedStudents.length > 0
      ? gradedStudents.reduce((acc, s) => acc + (s.grade || 0), 0) /
        gradedStudents.length
      : 0;

  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleAssignStudents = () => {
    if (selectedStudents.length > 0) {
      onAssignStudents(selectedStudents);
      setSelectedStudents([]);
    }
  };

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

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {homeworkTitle}
              </h2>
              <p className="text-gray-600 mt-1">
                Student Assignment & Statistics
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("assign")}
              className={`flex-1 py-2 rounded-md ${
                activeTab === "assign"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Assign Students
            </button>

            <button
              onClick={() => setActiveTab("statistics")}
              className={`flex-1 py-2 rounded-md ${
                activeTab === "statistics"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600"
              }`}
            >
              Statistics
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "assign" && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border rounded-lg w-full max-w-md"
                />

                <button
                  onClick={handleAssignStudents}
                  disabled={!selectedStudents.length}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                >
                  Assign Selected
                </button>
              </div>

              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center p-3 border-b hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                    />

                    <div className="ml-3 flex-1 flex justify-between">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          student.status,
                        )}`}
                      >
                        {student.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "statistics" && (
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Completed</p>
                <p className="text-2xl font-bold">{submittedCount}</p>
                <p className="text-sm text-gray-500">
                  out of {totalStudents} students
                </p>
              </div>

              {gradedStudents.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-lg font-semibold">Class Performance</p>

                  <p
                    className={`text-3xl font-bold ${getGradeColor(
                      averageGrade,
                    )}`}
                  >
                    {averageGrade.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
