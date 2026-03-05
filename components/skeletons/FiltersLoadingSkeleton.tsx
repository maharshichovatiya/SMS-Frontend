import React from "react";

function FiltersLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Class Filter Skeleton */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 h-5 w-24 bg-[var(--border)] rounded animate-pulse mb-4" />
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-[var(--border)] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[var(--border)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Academic Year Filter Skeleton */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 h-5 w-32 bg-[var(--border)] rounded animate-pulse mb-4" />
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-[var(--border)] rounded animate-pulse" />
              <div className="h-4 w-28 bg-[var(--border)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Gender Filter Skeleton */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 h-5 w-20 bg-[var(--border)] rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
              <div className="w-4 h-4 bg-[var(--border)] rounded animate-pulse" />
              <div className="h-4 w-16 bg-[var(--border)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Date Range Filter Skeleton */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 h-5 w-40 bg-[var(--border)] rounded animate-pulse mb-4" />
        <div className="space-y-4">
          <div>
            <div className="h-3 w-20 bg-[var(--border)] rounded mb-1 animate-pulse" />
            <div className="h-10 w-full bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div>
            <div className="h-3 w-16 bg-[var(--border)] rounded mb-1 animate-pulse" />
            <div className="h-10 w-full bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Family Income Range Filter Skeleton */}
      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center gap-2 h-5 w-48 bg-[var(--border)] rounded animate-pulse mb-4" />
        <div className="space-y-4">
          <div>
            <div className="h-3 w-28 bg-[var(--border)] rounded mb-1 animate-pulse" />
            <div className="h-10 w-full bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div>
            <div className="h-3 w-24 bg-[var(--border)] rounded mb-1 animate-pulse" />
            <div className="h-10 w-full bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiltersLoadingSkeleton;
