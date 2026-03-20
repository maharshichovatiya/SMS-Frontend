import React from "react";

function StudentDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-[22px] max-xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border-2 border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-gray-200"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-7 w-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
            <div className="h-6 w-40 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-[18px] py-3">
                <div className="w-[34px] h-[34px] rounded-[9px] bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex justify-between items-center">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-[18px] py-3">
                <div className="w-[45px] h-5 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2 pl-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboardSkeleton;
