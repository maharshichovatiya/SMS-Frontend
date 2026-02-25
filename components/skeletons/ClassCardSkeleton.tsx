import React from "react";

function ClassCardSkeleton() {
  return (
    <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-5 animate-pulse"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--border)]" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-[var(--border)] rounded" />
                <div className="h-3 w-16 bg-[var(--border)] rounded" />
              </div>
            </div>
            <div className="h-6 w-14 bg-[var(--border)] rounded-full" />
          </div>
          <div className="border-t border-[var(--border)] my-3" />
          <div className="space-y-2">
            <div className="h-3 w-3/4 bg-[var(--border)] rounded" />
            <div className="h-3 w-1/2 bg-[var(--border)] rounded" />
            <div className="h-3 w-2/3 bg-[var(--border)] rounded" />
          </div>
          <div className="flex gap-2 mt-4">
            <div className="flex-1 h-8 bg-[var(--border)] rounded-[var(--radius-sm)]" />
            <div className="flex-1 h-8 bg-[var(--border)] rounded-[var(--radius-sm)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClassCardSkeleton;
