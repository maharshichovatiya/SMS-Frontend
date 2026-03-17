import React from "react";

function ProfileSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow)] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
        <div className="h-6 w-32 bg-[var(--border)] rounded animate-pulse" />
        <div className="h-8 w-16 bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Profile Section with Avatar */}
        <div className="flex items-center gap-4 bg-[var(--bg-2)] rounded-[var(--radius-lg)] p-6">
          <div className="w-12 h-12 rounded-full bg-[var(--border)] animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-48 bg-[var(--border)] rounded animate-pulse" />
            <div className="h-4 w-64 bg-[var(--border)] rounded animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 1 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-20 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-24 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 2 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-20 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-16 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 3 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-16 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-20 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;
