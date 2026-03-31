"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import Modal from "@/components/ui/Modal";
import {
  homeworkSubmissionSchema,
  HomeworkSubmissionFormData,
} from "@/lib/validations/homeworkSubmission";
import { StudentSubmission, formatDate } from "./submission/SubmissionTypes";
import { HomeworkInfoCard } from "./submission/HomeworkInfoCard";
import { SubmissionPendingView } from "./submission/SubmissionPendingView";
import { SubmissionSubmittedView } from "./submission/SubmissionSubmittedView";
import { SubmissionGradedView } from "./submission/SubmissionGradedView";
import { SubmissionRejectedView } from "./submission/SubmissionRejectedView";

interface StudentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: StudentSubmission | null;
  onSubmit: (data: { file: File }) => void;
  onUpdate?: (data: { file: File }) => void;
}

// Re-export type so consumers don't need to import from two places
export type { StudentSubmission };

const TITLE_MAP = {
  pending: "Submit Homework",
  submitted: "Submission Details",
  graded: "Graded Submission",
  rejected: "Submission Rejected",
};

const DESC_SUFFIX = (
  submission: StudentSubmission,
  isPending: boolean,
): string => {
  if (isPending) return `Due: ${formatDate(submission.dueDate)}`;
  if (submission.status === "submitted") return "Submitted";
  if (submission.status === "rejected") return "Rejected by Teacher";
  return "Graded";
};

export const StudentSubmissionModal: React.FC<StudentSubmissionModalProps> = ({
  isOpen,
  onClose,
  submission,
  onSubmit,
  onUpdate,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Separate form state for the update
  const [updateFile, setUpdateFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateZone, setShowUpdateZone] = useState(false);

  // Resubmit state (for rejected submissions)
  const [resubmitFile, setResubmitFile] = useState<File | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [showResubmitZone, setShowResubmitZone] = useState(false);

  const { handleSubmit, setValue, watch, reset } = useForm({
    resolver: zodResolver(homeworkSubmissionSchema),
    defaultValues: { homeworkId: submission?.id ?? "", attachments: [] },
  });

  const selectedFiles = watch("attachments") as File[];

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
      await onSubmit({ file: data.attachments[0] });
      setUploadProgress(100);
      setTimeout(() => {
        setUploading(false);
        onClose();
        reset();
      }, 500);
    } catch {
      setUploading(false);
      alert("Failed to submit homework. Please try again.");
    }
  };

  const handleUpdateSubmit = async () => {
    if (!updateFile || !onUpdate) return;
    setIsUpdating(true);
    try {
      await onUpdate({ file: updateFile });
      setUpdateFile(null);
      setShowUpdateZone(false);
      onClose();
    } catch {
      alert("Failed to update submission. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResubmitSubmit = async () => {
    if (!resubmitFile || !onUpdate) return;
    setIsResubmitting(true);
    try {
      await onUpdate({ file: resubmitFile });
      setResubmitFile(null);
      setShowResubmitZone(false);
      onClose();
    } catch {
      alert("Failed to resubmit homework. Please try again.");
    } finally {
      setIsResubmitting(false);
    }
  };

  if (!isOpen || !submission) return null;

  const isPending = submission.status === "pending";
  const isSubmitted = submission.status === "submitted";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={TITLE_MAP[submission.status]}
      description={`${submission.subject} · ${DESC_SUFFIX(submission, isPending)}`}
      className="max-w-2xl"
      footer={
        <div className="flex items-center gap-3">
          {isPending ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-7 h-[52px] cursor-pointer rounded-[14px] border border-[var(--border)] text-[var(--text-2)] font-bold hover:bg-[var(--bg-2)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(handleFormSubmit)}
                disabled={selectedFiles.length === 0 || uploading}
                className="btn-primary disabled:opacity-60"
              >
                {uploading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <Upload className="w-4 h-4" />
                Submit Homework
              </button>
            </>
          ) : isSubmitted && showUpdateZone ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowUpdateZone(false);
                  setUpdateFile(null);
                }}
                className="px-7 h-[52px] cursor-pointer rounded-[14px] border border-[var(--border)] text-[var(--text-2)] font-bold hover:bg-[var(--bg-2)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateSubmit}
                disabled={!updateFile || isUpdating}
                className="btn-primary disabled:opacity-60"
              >
                {isUpdating && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <Upload className="w-4 h-4" />
                Update Submission
              </button>
            </>
          ) : submission?.status === "rejected" && showResubmitZone ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setShowResubmitZone(false);
                  setResubmitFile(null);
                }}
                className="px-7 h-[52px] cursor-pointer rounded-[14px] border border-[var(--border)] text-[var(--text-2)] font-bold hover:bg-[var(--bg-2)] transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResubmitSubmit}
                disabled={!resubmitFile || isResubmitting}
                className="btn-primary disabled:opacity-60"
                style={{ background: "var(--grad-primary)" }}
              >
                {isResubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <Upload className="w-4 h-4" />
                Resubmit Homework
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-7 h-[52px] cursor-pointer rounded-[14px] bg-[var(--blue)] text-white font-bold hover:bg-[var(--blue-dark)] transition"
            >
              Close
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5">
        {/* Always-visible homework info card */}
        <HomeworkInfoCard
          subject={submission.subject}
          title={submission.title}
          teacher={submission.teacher}
          dueDate={submission.dueDate}
        />

        {/* Status-specific content */}
        {isPending && (
          <SubmissionPendingView
            description={submission.description}
            dueDate={submission.dueDate}
            isDragging={isDragging}
            uploading={uploading}
            uploadProgress={uploadProgress}
            selectedFiles={selectedFiles}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) setValue("attachments", [file]);
            }}
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={e => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onFileSelect={file => setValue("attachments", [file])}
            onRemoveFile={() => setValue("attachments", [])}
          />
        )}

        {isSubmitted && (
          <SubmissionSubmittedView
            submission={submission}
            showUpdateZone={showUpdateZone}
            updateFile={updateFile}
            onToggleUpdateZone={() => {
              setShowUpdateZone(v => !v);
              setUpdateFile(null);
            }}
            onUpdateFileSelect={setUpdateFile}
            onUpdateFileRemove={() => setUpdateFile(null)}
            canUpdate={!!onUpdate && !!submission.submissionId}
          />
        )}

        {submission.status === "graded" && (
          <SubmissionGradedView submission={submission} />
        )}

        {submission.status === "rejected" && (
          <SubmissionRejectedView
            submission={submission}
            showResubmitZone={showResubmitZone}
            resubmitFile={resubmitFile}
            onToggleResubmitZone={() => {
              setShowResubmitZone(v => !v);
              setResubmitFile(null);
            }}
            onResubmitFileSelect={setResubmitFile}
            onResubmitFileRemove={() => setResubmitFile(null)}
            canResubmit={!!onUpdate && !!submission.submissionId}
          />
        )}
      </div>
    </Modal>
  );
};
