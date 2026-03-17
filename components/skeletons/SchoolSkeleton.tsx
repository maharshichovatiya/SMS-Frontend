import React from "react";

function SchoolSkeleton() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow)] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
        <div className="h-6 w-40 bg-[var(--border)] rounded animate-pulse" />
        <div className="h-8 w-16 bg-[var(--border)] rounded-[var(--radius-sm)] animate-pulse" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Form Fields Row 1 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-28 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-16 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 2 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-32 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-36 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 3 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-20 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-28 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 4 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-32 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-24 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 5 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-36 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-40 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 6 */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-32 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full">
            <div className="h-4 w-28 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
        </div>

        {/* Form Fields Row 7 - Single field */}
        <div className="flex items-start gap-3">
          <div className="w-full">
            <div className="h-4 w-20 bg-[var(--border)] rounded mb-2 animate-pulse" />
            <div className="h-10 w-full bg-[var(--bg-2)] rounded-[var(--radius-sm)] animate-pulse" />
          </div>
          <div className="w-full" />
        </div>
      </div>
    </div>
  );
}

export default SchoolSkeleton;
