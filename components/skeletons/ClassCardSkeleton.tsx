import React from "react";

function ClassCardSkeleton() {
  return (
    <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] p-4 sm:p-5 animate-pulse"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="h-7 w-16 bg-[var(--border)] rounded mb-2" />
              <div className="h-3 w-20 bg-[var(--border)] rounded" />
            </div>

            <div className="h-6 w-16 bg-[var(--border)] rounded-full" />
          </div>

          <div className="border-t border-[var(--border)] my-3" />

          <div className="space-y-2 mb-3">
            <div className="h-4 w-40 bg-[var(--border)] rounded" />
            <div className="h-3 w-32 bg-[var(--border)] rounded" />
          </div>

          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
            <div className="h-5 w-16 bg-[var(--border)] rounded-full" />
            <div className="h-5 w-12 bg-[var(--border)] rounded-full" />
          </div>

          <div className="border-t border-[var(--border)] my-3" />

          <div className="grid grid-cols-5 gap-3 mb-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j}>
                <div className="h-5 w-6 bg-[var(--border)] rounded mb-1" />
                <div className="h-2 w-12 bg-[var(--border)] rounded" />
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--border)] my-3" />

          <div className="flex justify-between items-center">
            <div className="h-8 w-20 bg-[var(--border)] rounded-md" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-[var(--border)] rounded-md" />
              <div className="h-8 w-16 bg-[var(--border)] rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClassCardSkeleton;
