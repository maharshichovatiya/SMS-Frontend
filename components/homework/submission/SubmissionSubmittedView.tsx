"use client";

import React from "react";
import { CheckCircle, RefreshCw } from "lucide-react";
import { formatDate, StudentSubmission } from "./SubmissionTypes";
import { SubmissionDetailsTable } from "./SubmissionDetailsTable";
import { FeedbackBlock } from "./FeedbackBlock";
import { FileUploadZone } from "./FileUploadZone";

interface SubmissionSubmittedViewProps {
  submission: StudentSubmission;
  showUpdateZone: boolean;
  updateFile: File | null;
  onToggleUpdateZone: () => void;
  onUpdateFileSelect: (file: File) => void;
  onUpdateFileRemove: () => void;
  canUpdate: boolean;
}

export const SubmissionSubmittedView: React.FC<
  SubmissionSubmittedViewProps
> = ({
  submission,
  showUpdateZone,
  updateFile,
  onToggleUpdateZone,
  onUpdateFileSelect,
  onUpdateFileRemove,
  canUpdate,
}) => (
  <div>
    {/* Success banner */}
    <div
      className="bg-[#f0fdf4] border-2 rounded-xl py-8 px-4 text-center mb-5"
      style={{ borderColor: "rgba(22, 163, 74, 0.35)" }}
    >
      <div
        className="w-15 h-15 rounded-full border-2 flex items-center justify-center mx-auto mb-3"
        style={{ borderColor: "rgba(22, 163, 74, 0.5)" }}
      >
        <CheckCircle className="text-xl font-bold text-[#16a34a]" />
      </div>
      <div className="text-lg font-bold text-[var(--text)] mb-1">
        Homework Submitted Successfully
      </div>
      <div className="text-sm text-[var(--text-3)]">
        Submitted on{" "}
        {submission.submittedAt ? formatDate(submission.submittedAt) : "—"} ·
        Awaiting review by {submission.teacher}
      </div>

      {canUpdate && (
        <button
          type="button"
          onClick={onToggleUpdateZone}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            showUpdateZone
              ? "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-2)]"
              : "bg-[#16a34a] text-white hover:bg-[#15803d]"
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          {showUpdateZone ? "Cancel Update" : "Update Submission"}
        </button>
      )}
    </div>

    {/* Update file zone */}
    {showUpdateZone && (
      <div className="mb-5">
        <FileUploadZone
          variant="compact"
          file={updateFile}
          onFileSelect={onUpdateFileSelect}
          onFileRemove={onUpdateFileRemove}
          label="Replace your submitted file"
          accentColor="var(--blue)"
          zoneBg="#eef2ff"
          fileIconBg="var(--blue-light)"
          fileIconColor="var(--blue)"
        />
      </div>
    )}

    {/* Details table */}
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
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[var(--blue-light)] text-[var(--blue)]"
          style={{ border: "1px solid rgba(59, 130, 246, 0.2)" }}
        >
          Under Review
        </span>
      }
    />

    {submission.notes && (
      <div className="mt-5">
        <FeedbackBlock
          emoji="📝"
          label="YOUR NOTES"
          text={submission.notes}
          accentColor="var(--blue)"
        />
      </div>
    )}
  </div>
);
