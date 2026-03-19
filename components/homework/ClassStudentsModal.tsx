"use client";

import React from "react";

interface Student {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    admissionNo?: string;
  };
}

interface Class {
  id: string;
  className: string;
  section: string;
  studentCapacity: number;
  classTeacher?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  students?: Student[];
}

interface ClassStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: Class | null;
}

export const ClassStudentsModal: React.FC<ClassStudentsModalProps> = ({
  isOpen,
  onClose,
  classInfo,
}) => {
  if (!isOpen || !classInfo) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
        <div className="px-4 sm:px-7 py-4 sm:py-6">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-1.5">
                Class Students
              </div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] text-[#111827] leading-[1.2] mb-2">
                {classInfo.className} - {classInfo.section}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[12px] sm:text-[13.5px] text-[#5c6a8a]">
                  {classInfo.studentCapacity} Students • Teacher:{" "}
                  {classInfo.classTeacher?.user?.firstName}{" "}
                  {classInfo.classTeacher?.user?.lastName}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
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

          <div className="px-4 sm:px-7 pb-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-3">
              {classInfo.students && classInfo.students.length > 0 ? (
                classInfo.students.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {student.user.firstName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111827]">
                          {student.user.firstName} {student.user.lastName}
                        </p>
                        <p className="text-xs text-[#9aa5c4]">
                          Admission No: {student.admissionNo || "N/A"} •{" "}
                          {student.user.email}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-[#5c6a8a]">
                  <p>No students found in this class.</p>
                  <p className="text-xs mt-2">
                    This class may not have any students assigned yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
