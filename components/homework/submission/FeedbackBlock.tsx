"use client";

import React from "react";

interface FeedbackBlockProps {
  label: string;
  emoji: string;
  text: string;
  accentColor?: string;
  borderColor?: string;
}

export const FeedbackBlock: React.FC<FeedbackBlockProps> = ({
  label,
  emoji,
  text,
  accentColor = "var(--blue)",
  borderColor,
}) => (
  <div>
    <div className="text-sm font-semibold text-[var(--text-3)] uppercase tracking-[0.5px] mb-2 flex items-center gap-1.5">
      {emoji} {label}
    </div>
    <div
      className="rounded-xl border bg-[var(--surface)] overflow-hidden"
      style={{ borderColor: borderColor ?? "var(--border)" }}
    >
      <div className="flex">
        <div
          className="w-1 flex-shrink-0"
          // style={{ backgroundColor: accentColor }}
        />
        <div className="p-4">
          <p className="text-sm text-[var(--text)] leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  </div>
);
