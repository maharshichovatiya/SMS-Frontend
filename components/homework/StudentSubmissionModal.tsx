"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Upload,
  Calendar,
  User,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Paperclip,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  homeworkSubmissionSchema,
  HomeworkSubmissionFormData,
} from "@/lib/validations/homeworkSubmission";

interface StudentSubmission {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  submittedAt?: string;
  file?: string;
  fileSize?: string;
  grade?: string;
  feedback?: string;
  notes?: string;
  teacher: string;
  description: string;
  className: string;
}

interface StudentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: StudentSubmission | null;
  onSubmit: (data: { file: File }) => void;
}

export const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock student ID - in real app, get from auth context
  const mockStudentId = "student-123";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(homeworkSubmissionSchema),
    defaultValues: {
      homeworkId: submission?.id || "",
      attachments: [],
    },
  });

  const selectedFiles = watch("attachments");

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateWarning = () => {
    if (!submission) return null;

    const daysLeft = getDaysRemaining(submission.dueDate);
    if (daysLeft <= 0) {
      return {
        bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
        textClass: "text-[#dc2626]",
        icon: <AlertTriangle className="w-4 h-4" />,
        dotColor: "#dc2626",
        text: "Past due! Submit immediately.",
      };
    } else if (daysLeft <= 1) {
      return {
        bgClass: "bg-[#fef2f2] border border-[#fca5a5]",
        textClass: "text-[#dc2626]",
        icon: <AlertTriangle className="w-4 h-4" />,
        dotColor: "#dc2626",
        text: "Due tomorrow — submit soon!",
      };
    } else if (daysLeft <= 3) {
      return {
        bgClass: "bg-[#fffbeb] border border-[#fcd34d]",
        textClass: "text-[#d97706]",
        icon: <Clock className="w-4 h-4" />,
        dotColor: "#d97706",
        text: `${daysLeft} days remaining — don't wait too long!`,
      };
    } else {
      return {
        bgClass: "bg-[#f0fdf4] border border-[#86efac]",
        textClass: "text-[#16a34a]",
        icon: <CheckCircle className="w-4 h-4" />,
        dotColor: "#16a34a",
        text: `${daysLeft} days remaining — you have plenty of time!`,
      };
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
      "text/x-python",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Invalid file type. Please upload PDF, DOC, DOCX, JPG, PNG, TXT, or PY files.",
      );
      return;
    }

    // Update form state
    setValue("attachments", [file]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFormSubmit = async (data: HomeworkSubmissionFormData) => {
    if (!submission) return;

    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Call the onSubmit prop with the file data
      await onSubmit({ file: data.attachments[0] });
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        onClose();
        reset(); // Reset form state
      }, 500);
    } catch (_error) {
      setUploading(false);
      alert("Failed to submit homework. Please try again.");
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

  if (!isOpen || !submission) return null;

  const warning = getDueDateWarning();
  const isPending = submission.status === "pending";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isPending
          ? "Submit Homework"
          : submission.status === "submitted"
            ? "Submission Details"
            : "Graded Submission"
      }
      description={`${submission.subject} · ${
        isPending
          ? `Due: ${formatDate(submission.dueDate)}`
          : submission.status === "submitted"
            ? "Submitted"
            : "Graded"
      }`}
      className="max-w-2xl"
      footer={
        <div className="flex gap-3 w-full">
          {isPending ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-[var(--surface-2)] text-[var(--text)] rounded-lg hover:bg-[var(--surface-3)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(handleFormSubmit)}
                disabled={selectedFiles.length === 0 || uploading}
                className="flex-1 px-4 py-2 bg-[var(--blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <Upload className="w-4 h-4" />
                Submit Homework
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[var(--blue)] text-white rounded-lg hover:bg-[var(--blue-dark)] transition-colors"
            >
              Close
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* ── PENDING: Submit Homework ── */}
        {isPending && warning && (
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
        )}

        {/* Homework info card */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[var(--blue)]" />
            <span className="font-semibold text-[var(--text)]">
              {submission.subject}
            </span>
            <span className="text-[var(--text-2)]">· {submission.title}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-[var(--text-3)]" />
            <span className="text-sm text-[var(--text)]">
              Teacher: <strong>{submission.teacher}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--text-3)]" />
            <span className="text-sm text-[var(--text)]">
              Due:{" "}
              <strong
                className={
                  getDaysRemaining(submission.dueDate) <= 0
                    ? "text-[var(--rose)]"
                    : getDaysRemaining(submission.dueDate) <= 1
                      ? "text-[#dc2626]"
                      : ""
                }
              >
                {formatDate(submission.dueDate)}
              </strong>
            </span>
          </div>
        </div>

        {isPending && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            <div className="flex">
              <div className="w-1 bg-[var(--blue)] flex-shrink-0 rounded-l-xl" />
              <div className="p-4">
                <p className="text-sm text-[var(--text)] leading-relaxed">
                  {submission.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {isPending && (
          <>
            <div>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[#6366f1] bg-[#eef2ff]"
                    : "border-[var(--border)] bg-[var(--surface-2)] hover:border-[#6366f1]"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-14 h-14 bg-[#6366f1] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div className="text-base font-semibold text-[var(--text)] mb-1">
                  Drag & drop your file here
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
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG, TXT, PY · Max
                  size: 25 MB
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.py"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </div>

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
                    onClick={() => setValue("attachments", [])}
                    className="p-2 text-[var(--rose)] hover:bg-[var(--rose-light)] rounded-lg transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>

                {uploading && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--blue)]">
                        Uploading...
                      </span>
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
          </>
        )}

        {submission.status === "submitted" && (
          <div>
            {/* Success banner */}
            <div className="bg-[#f0fdf4] rounded-xl py-8 px-4 text-center mb-5">
              <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-[#16a34a]" />
              </div>
              <div className="text-lg font-bold text-[var(--text)] mb-1">
                Homework Submitted Successfully
              </div>
              <div className="text-sm text-[var(--text-3)]">
                Submitted on {submission.submittedAt} · Awaiting review by{" "}
                {submission.teacher}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Homework</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {submission.title}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Subject</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {submission.subject}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Due Date</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatDate(submission.dueDate)}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Submitted</span>
                <span className="text-sm font-semibold text-[#16a34a]">
                  {submission.submittedAt}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">File</span>
                <span className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[var(--text-3)]" />
                  {submission.file} ({submission.fileSize})
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm text-[var(--text-3)]">Status</span>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)]"
                  style={{ borderColor: "rgba(59, 130, 246, 0.2)" }}
                >
                  Under Review
                </span>
              </div>
            </div>

            {submission.notes && (
              <div className="mt-5">
                <div className="text-sm font-semibold text-[var(--text-3)] uppercase tracking-[0.5px] mb-2 flex items-center gap-1.5">
                  📝 YOUR NOTES
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <div className="flex">
                    <div className="w-1 bg-[var(--blue)] flex-shrink-0" />
                    <div className="p-4">
                      <p className="text-sm text-[var(--text)] leading-relaxed">
                        {submission.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {submission.status === "graded" && (
          <div>
            <div
              className="rounded-xl border-2 border-[#16a34a] bg-[#f0fdf4] py-8 px-4 text-center mb-5"
              style={{ borderColor: "rgba(22, 163, 74, 0.35)" }}
            >
              <div
                className="w-20 h-20 rounded-full border-2 border-[#16a34a] flex items-center justify-center mx-auto mb-3"
                style={{ borderColor: "rgba(22, 163, 74, 0.5)" }}
              >
                <span className="text-2xl font-bold text-[#16a34a]">
                  {submission.grade}
                </span>
              </div>
              <div className="text-base font-semibold text-[var(--text)]">
                Your Grade
              </div>
            </div>

            {submission.feedback && (
              <div className="mb-5">
                <div className="text-sm font-semibold text-[var(--text-3)] uppercase tracking-[0.5px] mb-2 flex items-center gap-1.5">
                  💬 TEACHER FEEDBACK
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <div className="flex">
                    <div className="w-1 bg-[#16a34a] flex-shrink-0" />
                    <div className="p-4">
                      <p className="text-sm text-[var(--text)] leading-relaxed">
                        {submission.feedback}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Details table card */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Homework</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {submission.title}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Subject</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {submission.subject}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Due Date</span>
                <span className="text-sm font-semibold text-[var(--text)]">
                  {formatDate(submission.dueDate)}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">Submitted</span>
                <span className="text-sm font-semibold text-[#16a34a]">
                  {submission.submittedAt}
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-[var(--border)]">
                <span className="text-sm text-[var(--text-3)]">File</span>
                <span className="text-sm font-medium text-[var(--text)] flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-[var(--text-3)]" />
                  {submission.file} ({submission.fileSize})
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <span className="text-sm text-[var(--text-3)]">Grade</span>
                <span className="text-base font-bold text-[#16a34a]">
                  {submission.grade}
                </span>
              </div>
            </div>

            {submission.notes && (
              <div className="mt-5">
                <div className="text-sm font-semibold text-[var(--text-3)] uppercase tracking-[0.5px] mb-2 flex items-center gap-1.5">
                  📝 YOUR NOTES
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                  <div className="flex">
                    <div className="w-1 bg-[var(--blue)] flex-shrink-0" />
                    <div className="p-4">
                      <p className="text-sm text-[var(--text)] leading-relaxed">
                        {submission.notes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
