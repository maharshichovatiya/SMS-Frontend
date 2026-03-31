"use client";

import React from "react";
import { Calendar, User, FileText } from "lucide-react";
import { formatDate } from "./SubmissionTypes";

interface HomeworkInfoCardProps {
  subject: string;
  title: string;
  teacher: string;
  dueDate: string;
}

const getDaysRemaining = (dueDate: string) => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const HomeworkInfoCard: React.FC<HomeworkInfoCardProps> = ({
  subject,
  title,
  teacher,
  dueDate,
}) => {
  const daysLeft = getDaysRemaining(dueDate);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-4 h-4 text-[var(--blue)]" />
        <span className="font-semibold text-[var(--text)]">{subject}</span>
        <span className="text-[var(--text-2)]">· {title}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-[var(--text-3)]" />
        <span className="text-sm text-[var(--text)]">
          Teacher: <strong>{teacher}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-[var(--text-3)]" />
        <span className="text-sm text-[var(--text)]">
          Due:{" "}
          <strong
            className={
              daysLeft <= 0
                ? "text-[var(--rose)]"
                : daysLeft <= 1
                  ? "text-[#dc2626]"
                  : ""
            }
          >
            {formatDate(dueDate)}
          </strong>
        </span>
      </div>
    </div>
  );
};
