"use client";

import React, { useRef } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  Paperclip,
  Clock,
  CheckCircle,
} from "lucide-react";

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
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getDueDateWarning = (dueDate: string) => {
  const daysLeft = getDaysRemaining(dueDate);
  if (daysLeft <= 0)
    return {
      bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
      textClass: "text-[#dc2626]",
      icon: <AlertTriangle className="w-4 h-4" />,
      dotColor: "#dc2626",
      text: "Past due! Submit immediately.",
    };
  if (daysLeft <= 1)
    return {
      bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
      textClass: "text-[#dc2626]",
      icon: <AlertTriangle className="w-4 h-4" />,
      dotColor: "#dc2626",
      text: "Due tomorrow — submit soon!",
    };
  if (daysLeft <= 3)
    return {
      bgClass: "bg-[#fffbeb] border border-[#fcd34d]",
      textClass: "text-[#d97706]",
      icon: <Clock className="w-4 h-4" />,
      dotColor: "#d97706",
      text: `${daysLeft} days remaining — don't wait too long!`,
    };
  return {
    bgClass: "bg-[#f0fdf4] border border-[#86efac]",
    textClass: "text-[#16a34a]",
    icon: <CheckCircle className="w-4 h-4" />,
    dotColor: "#16a34a",
    text: `${daysLeft} days remaining — you have plenty of time!`,
  };
};

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
  "text/x-python",
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const warning = getDueDateWarning(dueDate);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert(
        "Invalid file type. Please upload PDF, DOC, DOCX, JPG, PNG, TXT, or PY files.",
      );
      return;
    }
    onFileSelect(file);
  };

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

      {/* Drop zone */}
      <div>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-[#6366f1] bg-[#eef2ff]"
              : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[#6366f1]"
          }`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-14 h-14 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div className="text-base font-semibold text-[var(--text)] mb-1">
            Drag &amp; drop your file here
          </div>
          <div className="text-sm text-[var(--text-3)] mb-4">
            or click to browse from your device
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6366f1] text-white rounded-lg hover:bg-[#4f46e5] transition-colors text-sm font-medium"
          >
            <Paperclip className="w-4 h-4" />
            Browse Files
          </button>
          <div className="text-xs text-[var(--text-3)] mt-4">
            Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT, PY · Max size: 25
            MB
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.py"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Selected file preview */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between p-4 bg-[var(--surface-2)] rounded-lg border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--blue-light)] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[var(--blue)]" />
              </div>
              <div>
                <div className="font-medium text-[var(--text)]">
                  {selectedFiles[0].name}
                </div>
                <div className="text-sm text-[var(--text-2)]">
                  {(selectedFiles[0].size / (1024 * 1024)).toFixed(1)} MB
                </div>
              </div>
            </div>
            <button
              onClick={onRemoveFile}
              className="p-2 text-[var(--rose)] hover:bg-[var(--rose-light)] rounded-lg transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>

          {uploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[var(--blue)]">Uploading...</span>
                <span className="text-sm text-[var(--text-2)]">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-[var(--border)] rounded-full h-2">
                <div
                  className="bg-[var(--blue)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
