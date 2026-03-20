import React from "react";

function NoticeCardSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm relative animate-pulse"
        >
          <div className="flex justify-between items-start mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="h-6 w-3/4 bg-gray-200 rounded mt-3 mb-2" />

          <div className="space-y-2 mb-4 mt-3">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-4">
            <div className="flex gap-2">
              <div className="w-20 h-5 bg-gray-200 rounded-full" />
              <div className="w-24 h-5 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

export default NoticeCardSkeleton;
