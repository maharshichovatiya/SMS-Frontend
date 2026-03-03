import React from "react";

function SubjectCardSkeleton() {
  return (
    <div className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-sm)] animate-pulse flex flex-col">
      <div className="flex-1">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-[var(--border)] mb-4" />

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="h-5 w-32 bg-[var(--border)] rounded mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-[var(--border)] rounded-full" />
              <div className="h-3 w-20 bg-[var(--border)] rounded" />
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="h-4 w-24 bg-[var(--border)] rounded" />
                <div className="h-3 w-20 bg-[var(--border)] rounded-full" />
                <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--border)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <div className="h-4 w-24 bg-[var(--border)] rounded" />
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--border)]" />
      </div>
    </div>
  );
}

export default SubjectCardSkeleton;
