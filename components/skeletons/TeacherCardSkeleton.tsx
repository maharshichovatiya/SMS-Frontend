import React from "react";

function TeacherCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-6 animate-pulse"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-2">
              <div className="h-4 w-28 sm:w-32 bg-[var(--border)] rounded" />
              <div className="h-3 w-16 sm:w-20 bg-[var(--border)] rounded" />
            </div>
            <div className="h-6 w-16 sm:w-20 bg-[var(--border)] rounded-full shrink-0" />
          </div>

          <div className="flex items-start gap-3 sm:gap-4 mt-4 sm:mt-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[var(--radius-md)] bg-[var(--border)]" />
            <div className="space-y-2 flex-1 min-w-0">
              <div className="h-3 w-3/4 bg-[var(--border)] rounded" />
              <div className="h-3 w-1/2 bg-[var(--border)] rounded" />
              <div className="h-3 w-2/3 bg-[var(--border)] rounded" />
              <div className="h-3 w-3/4 bg-[var(--border)] rounded" />
            </div>
          </div>

          <div className="border-t border-[var(--border)] my-4 sm:my-5" />

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="h-3 bg-[var(--border)] rounded" />
            <div className="h-3 bg-[var(--border)] rounded" />
            <div className="h-3 bg-[var(--border)] rounded" />
            <div className="h-3 bg-[var(--border)] rounded" />
          </div>

          <div className="flex gap-2 sm:gap-3 mt-5 sm:mt-6">
            <div className="flex-1 h-8 sm:h-9 bg-[var(--border)] rounded-[var(--radius-sm)]" />
            <div className="flex-1 h-8 sm:h-9 bg-[var(--border)] rounded-[var(--radius-sm)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TeacherCardSkeleton;
