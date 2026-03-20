import React from "react";

function NotificationSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-[18px] py-[14px] animate-pulse"
        >
          <div className="w-[38px] h-[38px] rounded-[10px] bg-gray-200 flex-shrink-0" />

          <div className="flex-1">
            <div className="mb-2 space-y-2 font-medium">
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>

            <div className="mt-[3px]">
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default NotificationSkeleton;
