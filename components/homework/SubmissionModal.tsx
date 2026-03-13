"use client";

import React from "react";

interface SubmissionModalProps {
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  submitted: number;
  total: number;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  title,
  subject,
  class: cls,
  teacher,
  dueDate,
  submitted,
  total,
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  const percentage = Math.round((submitted / total) * 100);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm z-30 pointer-events-none" />

      <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
          <div className="relative p-6 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
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

            <div className="pr-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-sm text-gray-600">
                {subject} • Class {cls} • {teacher} • Due: {dueDate}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {submitted}
                </div>
                <div className="text-xs text-gray-500 mt-1">Submitted</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {percentage}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Rate</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {total - submitted}
                </div>
                <div className="text-xs text-gray-500 mt-1">Pending</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{total}</div>
                <div className="text-xs text-gray-500 mt-1">Total</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Submission Progress
                </span>
                <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 bg-white">{children}</div>
        </div>
      </div>
    </>
  );
};
