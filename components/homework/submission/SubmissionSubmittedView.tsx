"use client";

import React from "react";
import { CheckCircle } from "lucide-react";
import { StudentSubmission } from "./SubmissionTypes";
import { SubmissionDetailsTable } from "./SubmissionDetailsTable";
import { FeedbackBlock } from "./FeedbackBlock";

interface SubmissionSubmittedViewProps {
  submission: StudentSubmission;
}

export const SubmissionSubmittedView: React.FC<
  SubmissionSubmittedViewProps
> = ({ submission }) => (
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
