"use client";

import React from "react";
import { Paperclip } from "lucide-react";
import { formatDate } from "./SubmissionTypes";

interface SubmissionDetailsTableProps {
  title: string;
  subject: string;
  dueDate: string;
  submittedAt?: string;
  file?: string;
  fileSize?: string;
  fileUrl?: string;
  lastRowLabel: string;
  lastRowValue: React.ReactNode;
}

export const SubmissionDetailsTable: React.FC<SubmissionDetailsTableProps> = ({
  title,
  subject,
  dueDate,
  submittedAt,
  file,
  fileSize,
  fileUrl,
  lastRowLabel,
  lastRowValue,
}) => {
  const row = (label: string, value: React.ReactNode, isLast = false) => (
    <div
      className={`flex justify-between items-center px-5 py-3.5 ${!isLast ? "border-b border-[var(--border)]" : ""}`}
    >
      <span className="text-sm text-[var(--text-3)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--text)]">{value}</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {row("Homework", title)}
      {row("Subject", subject)}
      {row("Due Date", formatDate(dueDate))}
      {submittedAt && (
        <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
          <span className="text-sm text-[var(--text-3)]">Submitted</span>
          <span className="text-sm font-semibold text-[#16a34a]">
            {submittedAt}
          </span>
        </div>
      )}
      <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
        <span className="text-sm text-[var(--text-3)]">File</span>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[var(--blue)] hover:underline flex items-center gap-1.5 transition-colors"
          >
            <Paperclip className="w-3.5 h-3.5" />
            {file} ({fileSize})
          </a>
        ) : (
          <span className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5 text-[var(--text-3)]" />
            {file} ({fileSize})
          </span>
        )}
      </div>
      <div className="flex justify-between items-center px-5 py-3.5">
        <span className="text-sm text-[var(--text-3)]">{lastRowLabel}</span>
        {lastRowValue}
      </div>
    </div>
  );
};
