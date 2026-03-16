"use client";

import React from "react";
import { Homework } from "@/lib/types/Homework";

interface FallbackHomeworkData {
  class?: string;
  className?: string;
  subject?: string;
  teacher?: string;
}

interface HomeworkDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  homework: Homework | null;
}

export const HomeworkDetailModal: React.FC<HomeworkDetailModalProps> = ({
  isOpen,
  onClose,
  homework,
}) => {
  if (!isOpen || !homework) return null;

  const getAssignedToDisplay = () => {
    if (!homework.assignments || homework.assignments.length === 0) {
      const fallbackData = homework as unknown as FallbackHomeworkData;
      if (fallbackData.class || fallbackData.className) {
        return `Class: ${fallbackData.class || fallbackData.className}`;
      }
      return "Not assigned";
    }

    const classAssignments = homework.assignments.filter(
      a => a.classId && !a.studentId,
    );
    const studentAssignments = homework.assignments.filter(
      a => a.studentId && !a.classId,
    );

    const assignedItems = [];

    if (classAssignments.length > 0) {
      const classNames = classAssignments
        .map(a => a.class?.className || "Unknown Class")
        .join(", ");
      assignedItems.push(`Classes: ${classNames}`);
    }

    if (studentAssignments.length > 0) {
      const studentNames = studentAssignments
        .map(a =>
          a.student?.user
            ? `${a.student.user.firstName} ${a.student.user.lastName}`
            : "Unknown Student",
        )
        .join(", ");
      assignedItems.push(`Students: ${studentNames}`);
    }

    return assignedItems.length > 0 ? assignedItems.join("; ") : "Not assigned";
  };

  const getStatusBadge = () => {
    switch (homework.status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-rose-100 text-rose-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = () => {
    switch (homework.status) {
      case "completed":
        return "Completed";
      case "expired":
        return "Expired";
      case "draft":
        return "Draft";
      default:
        return "Active";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[var(--z-modal)]">
      <div
        className="absolute inset-0 bg-[rgba(17,24,39,0.45)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative">
        <div className="px-4 sm:px-7 py-4 sm:py-6">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-1.5">
                Homework Details
              </div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] text-[#111827] leading-[1.2] mb-2">
                {homework.title}
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge()}`}
                >
                  {getStatusText()}
                </span>
                <span className="text-[12px] sm:text-[13.5px] text-[#5c6a8a]">
                  {homework.subject?.subjectName ||
                    (homework as unknown as FallbackHomeworkData).subject ||
                    "Subject"}{" "}
                  • {getAssignedToDisplay()}
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
        </div>

        <div className="px-4 sm:px-7 pb-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Assignment Information
                </h3>

                <div className="mb-6">
                  <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-2">
                    Title
                  </p>
                  <p className="text-base font-medium text-[#111827] leading-relaxed">
                    {homework.title}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-2">
                    Description
                  </p>
                  <p className="text-sm text-[#5c6a8a] leading-relaxed whitespace-pre-wrap">
                    {homework.description || "No description provided"}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-2">
                    Instructions
                  </p>
                  <p className="text-sm text-[#5c6a8a] leading-relaxed whitespace-pre-wrap">
                    {homework.instructions || "No instructions provided"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-1">
                      Assigned To
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {getAssignedToDisplay()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-1">
                      Assigned Date
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {new Date(homework.assignedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-1">
                      Due Date
                    </p>
                    <p className="text-sm font-medium text-[#111827]">
                      {new Date(homework.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#9aa5c4] uppercase tracking-[0.5px] mb-1">
                      Max File Size
                    </p>
                    <p className="text-sm font-medium text-[#111827]">10 MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#5c6a8a]">
                      Late Submission
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      Allowed
                    </span>
                  </div>
                  {homework.attachments && homework.attachments.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#5c6a8a]">
                        Attachments
                      </span>
                      <span className="text-sm font-semibold text-[#111827]">
                        {homework.attachments.length} files
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Assigned by
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#3d6cf4] rounded-full flex items-center justify-center text-white font-semibold">
                    {homework.teacher?.user?.firstName
                      ?.charAt(0)
                      .toUpperCase() ||
                      (homework as unknown as FallbackHomeworkData).teacher
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "T"}
                  </div>
                  <div>
                    <p className="font-medium text-[#111827]">
                      {homework.teacher?.user
                        ? `${homework.teacher.user.firstName} ${homework.teacher.user.lastName}`
                        : (homework as unknown as FallbackHomeworkData)
                            .teacher || "Teacher"}
                    </p>
                    <p className="text-sm text-[#5c6a8a]">
                      {homework.teacher?.designation || "Teacher"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Assigned Students
                </h3>
                {homework.assignments && homework.assignments.length > 0 ? (
                  <div className="space-y-3">
                    {homework.assignments.map(assignment => {
                      if (assignment.studentId && assignment.student) {
                        const student = assignment.student;
                        return (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                {student.user.firstName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#111827]">
                                  {`${student.user.firstName} ${student.user.lastName}`}
                                </p>
                                <p className="text-xs text-[#9aa5c4]">
                                  Admission No: {student.admissionNo} •{" "}
                                  {student.user.email}
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              Assigned
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}

                    {homework.assignments
                      .filter(a => a.classId && !a.studentId)
                      .map(assignment => {
                        const classInfo = assignment.class;
                        if (classInfo) {
                          return (
                            <div
                              key={assignment.id}
                              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                                  {classInfo.className}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#111827]">
                                    Class {classInfo.className} -{" "}
                                    {classInfo.section}
                                  </p>
                                  <p className="text-xs text-[#9aa5c4]">
                                    {classInfo.studentCapacity} students •
                                    Teacher:{" "}
                                    {classInfo.classTeacher?.user.firstName}{" "}
                                    {classInfo.classTeacher?.user.lastName}
                                  </p>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                All Students
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                ) : (
                  <div className="text-sm text-[#5c6a8a]">
                    <p>Student details not available in limited view mode.</p>
                    <p className="text-xs mt-2">
                      This is due to the database configuration issue. Once
                      resolved, full student lists will be displayed here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#111827] mb-4">
                  Submissions Summary
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-[#3d6cf4]">
                      {homework.submittedCount}
                    </p>
                    <p className="text-sm text-[#5c6a8a]">Submitted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {homework.pendingCount}
                    </p>
                    <p className="text-sm text-[#5c6a8a]">Pending</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">
                      {homework.totalAssignedTo}
                    </p>
                    <p className="text-sm text-[#5c6a8a]">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {homework.attachments && homework.attachments.length > 0 ? (
              <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#111827] mb-4">
                    Attachments
                  </h3>
                  <div className="space-y-3">
                    {homework.attachments.map(attachment => {
                      const isPdf = attachment.fileType === "application/pdf";
                      const fileName = attachment.fileName;

                      return (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                isPdf ? "bg-red-100" : "bg-blue-100"
                              }`}
                            >
                              {isPdf ? (
                                <svg
                                  className="w-5 h-5 text-red-600"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V15L13,19H10Z" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[#111827]">
                                {fileName}
                              </p>
                              <p className="text-xs text-[#9aa5c4]">
                                {attachment.fileSize} •{" "}
                                {isPdf ? "PDF Document" : "File"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = attachment.fileUrl;
                              link.download = fileName;
                              link.target = "_blank";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#3d6cf4] text-white text-sm font-medium rounded-lg hover:bg-[#2a5adb] transition-colors cursor-pointer"
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>Download</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#111827] mb-4">
                    Attachments
                  </h3>
                  <p className="text-sm text-[#5c6a8a]">
                    No attachments available (limited view due to database
                    configuration)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-7 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
