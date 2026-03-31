"use client";

import React from "react";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import type { StudentSubmission } from "./submission/SubmissionTypes";

interface StudentSubmissionTableProps {
  submissions: StudentSubmission[];
  onViewSubmission: (submission: StudentSubmission) => void;
  onSubmitHomework: (submission: StudentSubmission) => void;
}

export const StudentSubmissionTable: React.FC<StudentSubmissionTableProps> = ({
  submissions,
  onViewSubmission,
  onSubmitHomework,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-[var(--amber-light)] text-[var(--amber)]";
      case "submitted":
        return "bg-[var(--blue-light)] text-[var(--blue)]";
      case "graded":
        return "bg-[var(--green-light)] text-[var(--green)]";
      case "rejected":
        return "bg-[#fef2f2] text-[#dc2626]";
      default:
        return "bg-[var(--gray-light)] text-[var(--gray)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "submitted":
        return <FileText className="w-3 h-3" />;
      case "graded":
        return <CheckCircle className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <div className="text-[17px] font-bold text-[var(--text)]">
          My Submissions
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                Homework
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                Subject
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                Due Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 px-4 text-center border-b border-[var(--border)]"
                >
                  <div className="flex flex-col items-center justify-center text-[var(--text-3)]">
                    <FileText className="w-10 h-10 mb-3 opacity-20" />
                    <p className="text-sm font-medium">No submissions yet</p>
                    <p className="text-xs mt-1">
                      You haven&apos;t received any assignments to submit.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              submissions.map((submission, _index) => (
                <tr
                  key={submission.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[var(--text)]">
                      {submission.title}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-[var(--text)]">
                      {submission.subject}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`text-sm ${
                        getDaysRemaining(submission.dueDate) <= 0
                          ? "text-[var(--rose)] font-semibold"
                          : "text-[var(--text-2)]"
                      }`}
                    >
                      {formatDate(submission.dueDate)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-[11px] py-[3px] rounded-full text-[11.5px] font-semibold ${getStatusColor(submission.status)}`}
                    >
                      {getStatusIcon(submission.status)}
                      <span className="capitalize">
                        {submission.status === "rejected"
                          ? "Rejected"
                          : submission.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {submission.status === "pending" ? (
                      <button
                        onClick={() => onSubmitHomework(submission)}
                        className="px-3 py-1.5 bg-[var(--blue-light)] text-[var(--blue)] rounded-lg hover:bg-[var(--blue)] hover:text-white transition-colors text-[12px] font-medium"
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={() => onViewSubmission(submission)}
                        className="px-3 py-1.5 bg-[var(--green-light)] text-[var(--green)] rounded-lg hover:bg-[var(--green)] hover:text-white transition-colors text-[12px] font-medium"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
