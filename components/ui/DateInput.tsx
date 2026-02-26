"use client";

import React, { forwardRef } from "react";
import { Calendar } from "lucide-react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: boolean;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, icon = true, className = "", ...props }, ref) => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-bold text-[var(--text)] mb-1 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            {...props}
            ref={ref}
            type="date"
            max={today}
            className={`
              w-full px-4 py-2 text-sm border border-[var(--border)] rounded-[8px] 
              bg-[var(--surface)] text-[var(--text)] 
              focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)]
              transition-all duration-[var(--duration)]
              placeholder:text-[var(--text-3)]
              ${error ? "border-[var(--rose)] focus:ring-[var(--rose-muted)]" : ""}
              ${icon ? "pl-10" : "pl-4"}
              ${className}
            `}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none group-hover:text-blue-500 transition-colors duration-200">
              <Calendar className="w-4 h-4" />
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 animate-fade-in">
            <div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4-4m0 4h8m-12 0l6 6m0 6h12"
                />
              </svg>
            </div>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;
