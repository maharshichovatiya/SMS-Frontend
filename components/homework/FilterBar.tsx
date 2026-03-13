"use client";

import React from "react";

interface FilterOption {
  label: string;
  value: string;
  count: number;
}

interface FilterBarProps {
  activeFilter: string;
  filters: FilterOption[];
  onFilterChange: (value: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  filters,
  onFilterChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto pb-2 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter.value
              ? "bg-[var(--blue)] text-white"
              : "bg-[var(--bg)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-2)] hover:border-[var(--border-2)]"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="font-medium">{filter.label}</span>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
                activeFilter === filter.value
                  ? "bg-white/20 text-white"
                  : "bg-[var(--bg-2)] text-[var(--text)]"
              }`}
            >
              {filter.count}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
};
