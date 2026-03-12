"use client";

import React from "react";

interface NotificationFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: Record<string, number>;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "high", label: "High Priority" },
    { id: "medium", label: "Medium Priority" },
    { id: "low", label: "Low Priority" },
  ];

  return (
    <div className="flex items-center flex-wrap gap-2 mb-[18px]">
      {filters.map(filter => {
        const isActive = activeFilter === filter.id;
        const count = counts[filter.id] ?? 0;

        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`
              px-[18px] py-2 rounded-full text-[13px] font-[var(--font-sans)] flex items-center gap-1.5 whitespace-nowrap transition-all duration-200
              ${
                isActive
                  ? "font-semibold border-2 border-[var(--notification-accent)] bg-[var(--notification-accent)] text-[var(--notification-bg)]"
                  : "font-medium border-[1.5px] border-[var(--notification-border)] bg-[var(--notification-bg)] text-[var(--notification-text-primary)] hover:bg-[var(--notification-bg-hover)] hover:border-[var(--notification-accent)]"
              }
            `}
          >
            {filter.label}
            {count > 0 && (
              <span
                className={`
                  px-[7px] py-0.5 rounded-full min-w-[20px] text-center text-[10px] font-bold
                  ${
                    isActive
                      ? "bg-white/30 text-[var(--notification-bg)]"
                      : "bg-[var(--notification-accent-light)] text-[var(--notification-accent)]"
                  }
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationFilters;
