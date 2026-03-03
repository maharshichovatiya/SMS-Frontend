import React from "react";

export default function DashboardTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-[var(--border)]">
          <td className="px-[18px] py-[13px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-9 h-9 rounded-full bg-[var(--border)] animate-pulse"></div>
              <div>
                <div className="h-4 w-24 bg-[var(--border)] rounded mb-1 animate-pulse"></div>
                <div className="h-3 w-16 bg-[var(--border)] rounded animate-pulse"></div>
              </div>
            </div>
          </td>
          <td className="px-[18px] py-[13px]">
            <div className="h-6 w-12 bg-[var(--border)] rounded-full animate-pulse"></div>
          </td>
          <td className="px-[18px] py-[13px]">
            <div className="h-6 w-20 bg-[var(--border)] rounded-full animate-pulse"></div>
          </td>
          <td className="px-[18px] py-[13px]">
            <div className="h-6 w-16 bg-[var(--border)] rounded-full animate-pulse"></div>
          </td>
          <td className="px-[18px] py-[13px]">
            <div className="h-4 w-16 bg-[var(--border)] rounded animate-pulse"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
