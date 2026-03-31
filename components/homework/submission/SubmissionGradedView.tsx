"use client";

import React from "react";
import { StudentSubmission, getLetterGrade } from "./SubmissionTypes";
import { SubmissionDetailsTable } from "./SubmissionDetailsTable";
import { FeedbackBlock } from "./FeedbackBlock";

interface SubmissionGradedViewProps {
  submission: StudentSubmission;
}

export const SubmissionGradedView: React.FC<SubmissionGradedViewProps> = ({
  submission,
}) => (
  <div>
    {/* Grade banner */}
    <div
      className="rounded-xl border-2 bg-[#f0fdf4] py-8 px-4 text-center mb-5"
      style={{ borderColor: "rgba(22, 163, 74, 0.35)" }}
    >
      <div
        className="w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-3"
        style={{ borderColor: "rgba(22, 163, 74, 0.5)" }}
      >
        <span className="text-2xl font-bold text-[#16a34a]">
          {getLetterGrade(Number(submission.grade))}
        </span>
      </div>
      <div className="text-base font-semibold text-[var(--text)] flex flex-col items-center gap-1">
        <span>Your Grade</span>
        <span className="text-sm font-medium text-[#16a34a] bg-[#dcfce7] px-2.5 py-0.5 rounded-full border border-green-200">
          {submission.grade} / {submission.maxMarks || 100} Marks
        </span>
      </div>
    </div>

    {/* Teacher feedback */}
    {submission.feedback && (
      <div className="mb-5">
        <FeedbackBlock
          emoji="💬"
          label="TEACHER FEEDBACK"
          text={submission.feedback}
          accentColor="#16a34a"
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
      lastRowLabel="Grade / Marks"
      lastRowValue={
        <span className="text-base font-bold text-[#16a34a]">
          {getLetterGrade(Number(submission.grade))} ({submission.grade})
        </span>
      }
    />

    {/* Student notes */}
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
