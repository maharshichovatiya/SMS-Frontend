"use client";

import React from "react";
import { FileUploadZone } from "./FileUploadZone";

interface SubmissionPendingViewProps {
  description: string;
  dueDate: string;
  isDragging: boolean;
  uploading: boolean;
  uploadProgress: number;
  selectedFiles: File[];
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onFileSelect: (file: File) => void;
  onRemoveFile: () => void;
}

const getDaysRemaining = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const getDueDateWarning = (dueDate: string) => {
  const daysLeft = getDaysRemaining(dueDate);
  if (daysLeft <= 0)
    return {
      bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
      textClass: "text-[#dc2626]",
      dotColor: "#dc2626",
      text: "Past due! Submit immediately.",
    };
  if (daysLeft <= 1)
    return {
      bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
      textClass: "text-[#dc2626]",
      dotColor: "#dc2626",
      text: "Due tomorrow — submit soon!",
    };
  if (daysLeft <= 3)
    return {
      bgClass: "bg-[#fffbeb] border border-[#fcd34d]",
      textClass: "text-[#d97706]",
      dotColor: "#d97706",
      text: `${daysLeft} days remaining — don't wait too long!`,
    };
  return {
    bgClass: "bg-[#f0fdf4] border border-[#86efac]",
    textClass: "text-[#16a34a]",
    dotColor: "#16a34a",
    text: `${daysLeft} days remaining — you have plenty of time!`,
  };
};

export const SubmissionPendingView: React.FC<SubmissionPendingViewProps> = ({
  description,
  dueDate,
  isDragging,
  uploading,
  uploadProgress,
  selectedFiles,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileSelect,
  onRemoveFile,
}) => {
  const warning = getDueDateWarning(dueDate);

  return (
    <div className="space-y-5">
      {/* Due-date warning banner */}
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${warning.bgClass}`}
      >
        <span
          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: warning.dotColor }}
        />
        <span className={`text-sm font-semibold ${warning.textClass}`}>
          {warning.text}
        </span>
      </div>

      {/* Description */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <div className="flex">
          <div className="w-1 bg-[var(--blue)] flex-shrink-0 rounded-l-xl" />
          <div className="p-4">
            <p className="text-sm text-[var(--text)] leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* File upload zone */}
      <FileUploadZone
        variant="full"
        file={selectedFiles[0] ?? null}
        onFileSelect={onFileSelect}
        onFileRemove={onRemoveFile}
        isDragging={isDragging}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        uploading={uploading}
        uploadProgress={uploadProgress}
        accentColor="#6366f1"
        zoneBg="#eef2ff"
      />
    </div>
  );
};
