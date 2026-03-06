"use client";

import React, { useState, useEffect } from "react";
import { Filter, X, ChevronRight, BookOpen, TrendingUp } from "lucide-react";

interface SubjectFiltersProps {
  filters: {
    minPassingMarks?: string;
    maxPassingMarks?: string;
    minTotalMarks?: string;
    maxTotalMarks?: string;
  };
  onClearFilters: () => void;
  onApplyFilters: (filters: SubjectFiltersProps["filters"]) => void;
}

export default function SubjectFilters({
  filters,
  onClearFilters,
  onApplyFilters,
}: SubjectFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync localFilters with external filters when they change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== "",
  );

  const hasLocalChanges =
    JSON.stringify(localFilters) !== JSON.stringify(filters);

  const handleInputChange = (
    filterName: keyof SubjectFiltersProps["filters"],
    value: string,
  ) => {
    setLocalFilters({
      ...localFilters,
      [filterName]: value || undefined,
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleClearLocalFilters = () => {
    setLocalFilters({});
    onClearFilters();
  };

  return (
    <>
      {/* Filter Button - positioned beside search bar */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-[var(--duration)] cursor-pointer ${
          hasActiveFilters
            ? "bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)]"
            : "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--bg-2)]"
        }`}
      >
        <Filter size={16} />
        Filters
        {hasActiveFilters && (
          <span className="w-5 h-5 bg-[var(--blue)] text-[var(--text-inverse)] text-xs rounded-full flex items-center justify-center">
            {
              Object.values(filters).filter(
                value => value !== undefined && value !== "",
              ).length
            }
          </span>
        )}
        <ChevronRight size={16} className={isOpen ? "rotate-180" : ""} />
      </button>

      {/* Right Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed right-0 top-0 h-full w-96 bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-lg)] z-50 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearLocalFilters}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--text-2)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[var(--radius-sm)] transition-colors duration-[var(--duration)] cursor-pointer"
                    >
                      <X size={14} />
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-[var(--radius-sm)] hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors duration-[var(--duration)] cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="space-y-6">
                {/* Passing Marks Range Filter */}
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                    <BookOpen size={16} />
                    Passing Marks Range
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                        Minimum Passing Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 35"
                        value={localFilters.minPassingMarks || ""}
                        onChange={e =>
                          handleInputChange("minPassingMarks", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                        Maximum Passing Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={localFilters.maxPassingMarks || ""}
                        onChange={e =>
                          handleInputChange("maxPassingMarks", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Total Marks Range Filter */}
                <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                    <TrendingUp size={16} />
                    Total Marks Range
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                        Minimum Total Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 100"
                        value={localFilters.minTotalMarks || ""}
                        onChange={e =>
                          handleInputChange("minTotalMarks", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                        Maximum Total Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 500"
                        value={localFilters.maxTotalMarks || ""}
                        onChange={e =>
                          handleInputChange("maxTotalMarks", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-4 mt-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setLocalFilters(filters);
                      setIsOpen(false);
                    }}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    disabled={!hasLocalChanges}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--blue)] rounded-[var(--radius-sm)] hover:bg-[var(--blue-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-[var(--duration)] cursor-pointer"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
