import React from "react";

function StudentTableSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Table Header */}
      <div className="bg-[var(--surface-2)] px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--border)] animate-pulse" />
            <div className="h-5 w-32 bg-[var(--border)] rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-40 bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
            <div className="h-9 w-20 bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-[var(--border)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-6 py-4 hover:bg-[var(--surface-2)] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--border)] animate-pulse" />
                <div>
                  <div className="h-4 w-32 bg-[var(--border)] rounded mb-2 animate-pulse" />
                  <div className="h-3 w-24 bg-[var(--border)] rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 bg-[var(--border)] rounded animate-pulse" />
                <div className="h-4 w-16 bg-[var(--border)] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[var(--border)] rounded animate-pulse" />
                <div className="h-6 w-6 rounded bg-[var(--border)] animate-pulse" />
                <div className="h-6 w-6 rounded bg-[var(--border)] animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentTableSkeleton;
