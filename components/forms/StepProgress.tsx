import React from "react";

interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-2 mt-4 w-full">
        {[1, 2].map((step, idx) => (
          <React.Fragment key={step}>
            <div
              className={`flex items-center justify-center ml-5 w-8 h-8 mr-5 rounded-full text-sm font-bold transition-all ${
                currentStep >= step
                  ? "bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step}
            </div>
            {idx === 0 && (
              <div
                className={`flex-1 h-0.5 transition-all ${
                  currentStep >= 2
                    ? "bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)]"
                    : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between gap-8 text-xs w-full font-medium text-gray-600 mt-2">
        <span
          className={currentStep === 1 ? "text-[var(--blue)] font-bold" : ""}
        >
          Personal Info
        </span>
        <span
          className={currentStep === 2 ? "text-[var(--blue)] font-bold" : ""}
        >
          School Details
        </span>
      </div>
    </>
  );
}
