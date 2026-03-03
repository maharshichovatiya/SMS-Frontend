"use client";

import React, { forwardRef } from "react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-bold text-[var(--text)] mb-1 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative group cursor-pointer">
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
              cursor-pointer
              [&::-webkit-calendar-picker-indicator]:cursor-pointer
              ${error ? "border-[var(--rose)] focus:ring-[var(--rose-muted)]" : ""}
              ${className}
            `}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs font-medium text-[var(--rose)]">{error}</p>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";

export default DateInput;
