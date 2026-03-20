import React from "react";

function TeacherDashboardSkeleton() {
  return (
    <div className="space-y-[22px] animate-pulse">
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

      <div className="grid grid-cols-[1fr_300px] gap-5 mb-[22px] max-lg:grid-cols-1">
        <div className="space-y-[22px]">
          <div className="bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="h-6 w-40 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="p-[18px] space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="h-6 w-40 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="p-[18px] space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div className="bg-white border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="px-[18px] py-[13px] border-b border-[var(--border)] flex gap-3"
              >
                <div className="w-[34px] h-[34px] rounded-[9px] bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboardSkeleton;
