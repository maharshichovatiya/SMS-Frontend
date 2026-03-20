import React from "react";

function HomeworkSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border-2 border-gray-300 rounded-2xl shadow-lg overflow-hidden animate-pulse"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>

                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded mb-5"></div>

                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-200 rounded-full mr-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>

                <div className="h-7 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
              <div className="flex space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default HomeworkSkeleton;
