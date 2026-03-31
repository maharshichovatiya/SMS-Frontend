"use client";

import React from "react";
import { XCircle, RefreshCw } from "lucide-react";
import { StudentSubmission } from "./SubmissionTypes";
import { SubmissionDetailsTable } from "./SubmissionDetailsTable";
import { FeedbackBlock } from "./FeedbackBlock";
import { FileUploadZone } from "./FileUploadZone";

interface SubmissionRejectedViewProps {
  submission: StudentSubmission;
  showResubmitZone: boolean;
  resubmitFile: File | null;
  onToggleResubmitZone: () => void;
  onResubmitFileSelect: (file: File) => void;
  onResubmitFileRemove: () => void;
  canResubmit: boolean;
}

export const SubmissionRejectedView: React.FC<SubmissionRejectedViewProps> = ({
  submission,
  showResubmitZone,
  resubmitFile,
  onToggleResubmitZone,
  onResubmitFileSelect,
  onResubmitFileRemove,
  canResubmit,
}) => (
  <div>
    {/* Rejection banner */}
    <div
      className="rounded-xl border-2 bg-[#fef2f2] py-8 px-4 text-center mb-5"
      style={{ borderColor: "rgba(220, 38, 38, 0.35)" }}
    >
      <div
        className="w-15 h-15 rounded-full border-2 flex items-center justify-center mx-auto mb-3"
        style={{ borderColor: "rgba(220, 38, 38, 0.5)" }}
      >
        <XCircle className="text-xl font-bold text-[#dc2626]" />
      </div>
      <div className="text-base font-semibold text-[var(--text)] flex flex-col items-center gap-1">
        <span>Submission Rejected</span>
        <span className="text-sm font-medium text-[#dc2626] bg-[#fee2e2] px-2.5 py-0.5 rounded-full border border-red-200">
          Teacher has rejected your submission
        </span>
      </div>

      {canResubmit && (
        <button
          type="button"
          onClick={onToggleResubmitZone}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            showResubmitZone
              ? "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-2)]"
              : "bg-[#dc2626] text-white hover:bg-[#b91c1c]"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          {showResubmitZone ? "Cancel Resubmit" : "Resubmit Homework"}
        </button>
      )}
    </div>

    {/* Resubmit file zone */}
    {showResubmitZone && (
      <div className="mb-5">
        <FileUploadZone
          variant="compact"
          file={resubmitFile}
          onFileSelect={onResubmitFileSelect}
          onFileRemove={onResubmitFileRemove}
          label="Upload a new file to resubmit"
          accentColor="#dc2626"
          zoneBg="#fef2f2"
          fileIconBg="#fee2e2"
          fileIconColor="#dc2626"
        />
      </div>
    )}

    {/* Teacher feedback */}
    {submission.feedback && (
      <div className="mb-5">
        <FeedbackBlock
          emoji="💬"
          label="TEACHER FEEDBACK"
          text={submission.feedback}
          accentColor="#dc2626"
          borderColor="#fca5a5"
        />
      </div>
    )}

    {/* Details */}
    <SubmissionDetailsTable
      title={submission.title}
      subject={submission.subject}
      dueDate={submission.dueDate}
      submittedAt={submission.submittedAt}
      file={submission.file}
      fileSize={submission.fileSize}
      fileUrl={submission.fileUrl}
      lastRowLabel="Status"
      lastRowValue={
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fee2e2] text-[#dc2626] border border-red-200">
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </span>
      }
    />
  </div>
);
