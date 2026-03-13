"use client";

import React, { useState } from "react";

interface SubmissionItemProps {
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: "submitted" | "graded" | "late" | "pending";
  grade?: string;
  feedback?: string;
  isTeacher?: boolean;
  onGrade?: (grade: string) => void;
}

export const SubmissionItem: React.FC<SubmissionItemProps> = ({
  studentName,
  studentId,
  submittedDate,
  status,
  grade,
  feedback,
  isTeacher,
  onGrade,
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [gradeInput, setGradeInput] = useState(grade || "");
  const [feedbackInput, setFeedbackInput] = useState(feedback || "");

  const getStatusColor = () => {
    switch (status) {
      case "graded":
        return "bg-[#12a47e] text-white";
      case "late":
        return "bg-[#e83b6a] text-white";
      case "pending":
        return "bg-[#e08c17] text-white";
      default:
        return "bg-[#3d6cf4] text-white";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "graded":
        return "Graded";
      case "late":
        return "Late";
      case "pending":
        return "Not Submitted";
      default:
        return "Submitted";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm">
              {studentName
                .split(" ")
                .map(n => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {studentName}
              </p>
              <p className="text-sm text-gray-500">{studentId}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </span>
        </div>
      </div>

      <div className="p-6">
        {status !== "pending" && (
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Submitted Date
                </div>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  {submittedDate}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">
                  File
                </div>
                <div className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 truncate">
                  {studentId.toLowerCase()}_assignment.pdf
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {status !== "pending" && (
            <>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
                Download
              </button>

              {isTeacher && status !== "graded" && (
                <div className="flex items-center gap-2 ml-auto">
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={e => setGradeInput(e.target.value)}
                    placeholder="Grade"
                    maxLength={3}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg text-center font-semibold focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    onClick={() => onGrade?.(gradeInput)}
                    className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}

              {isTeacher && (
                <button
                  onClick={() => setShowFeedback(!showFeedback)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Feedback
                </button>
              )}
            </>
          )}

          {status === "pending" && isTeacher && (
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
              Send Reminder
            </button>
          )}
        </div>

        {isTeacher && showFeedback && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <textarea
              placeholder="Write feedback..."
              value={feedbackInput}
              onChange={e => setFeedbackInput(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-3">
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Save Feedback
              </button>
              <button
                onClick={() => setShowFeedback(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
