import React from "react";

function ResourceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="relative bg-white border border-gray-200 rounded-md p-4 animate-pulse overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-md"></div>

          <div className="h-7 w-24 bg-gray-200 rounded mb-2 mt-1"></div>

          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <span className="text-gray-300 text-xs text-[10px]">·</span>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResourceSkeleton;
