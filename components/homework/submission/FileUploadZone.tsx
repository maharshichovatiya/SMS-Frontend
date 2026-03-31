"use client";

import React, { useRef } from "react";
import { Upload, FileText, Paperclip, X } from "lucide-react";

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "text/plain",
  "text/x-python",
];

export const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.py";

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accentColor?: string;
  zoneBg?: string;
  fileIconBg?: string;
  fileIconColor?: string;
  isDragging?: boolean;
  onDrop?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  variant?: "full" | "compact";
  uploading?: boolean;
  uploadProgress?: number;
  label?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  file,
  onFileSelect,
  onFileRemove,
  accentColor = "#6366f1",
  zoneBg = "#eef2ff",
  fileIconBg = "var(--blue-light)",
  fileIconColor = "var(--blue)",
  isDragging = false,
  onDrop,
  onDragOver,
  onDragLeave,
  variant = "compact",
  uploading = false,
  uploadProgress = 0,
  label,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_FILE_TYPES.includes(f.type)) {
      alert(
        "Invalid file type. Please upload PDF, DOC, DOCX, JPG, PNG, TXT, or PY files.",
      );
      e.target.value = "";
      return;
    }
    onFileSelect(f);
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <p
          className="text-sm font-semibold mb-1 flex items-center gap-2"
          style={{ color: accentColor }}
        >
          <Upload className="w-4 h-4" />
          {label}
        </p>
      )}

      {file ? (
        <div
          className="flex items-center justify-between p-3 rounded-lg border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: fileIconBg }}
            >
              <FileText className="w-4 h-4" style={{ color: fileIconColor }} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text)] truncate max-w-[220px]">
                {file.name}
              </div>
              <div className="text-xs text-[var(--text-3)]">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{ color: accentColor }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : variant === "full" ? (
        <div
          className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
          style={{
            borderColor: isDragging ? accentColor : "var(--border)",
            background: isDragging ? zoneBg : "var(--surface-2)",
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={openPicker}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: accentColor }}
          >
            <Upload className="w-7 h-7 text-white" />
          </div>
          <div className="text-base font-semibold text-[var(--text)] mb-1">
            Drag &amp; drop your file here
          </div>
          <div className="text-sm text-[var(--text-3)] mb-4">
            or click to browse from your device
          </div>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              openPicker();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition-colors text-sm font-medium hover:opacity-90"
            style={{ background: accentColor }}
          >
            <Paperclip className="w-4 h-4" />
            Browse Files
          </button>
          <div className="text-xs text-[var(--text-3)] mt-4">
            Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT, PY · Max size: 25
            MB
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:opacity-80"
          style={{ borderColor: accentColor, background: zoneBg }}
          onClick={openPicker}
        >
          <Upload
            className="w-8 h-8 opacity-60"
            style={{ color: accentColor }}
          />
          <p className="text-sm text-[var(--text-2)]">
            Click to browse or drag &amp; drop a new file
          </p>
          <p className="text-xs text-[var(--text-3)]">
            PDF, DOC, DOCX, JPG, PNG, TXT, PY · Max 25 MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleInputChange}
      />

      {uploading && file && (
        <div className="mt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm" style={{ color: accentColor }}>
              Uploading...
            </span>
            <span className="text-sm text-[var(--text-2)]">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-[var(--border)] rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%`, background: accentColor }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
