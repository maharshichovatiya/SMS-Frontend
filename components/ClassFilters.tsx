"use client";

import React, { useState } from "react";
import {
  Filter,
  X,
  Search,
  ChevronRight,
  Users,
  Layers,
  CircleDot,
  CheckCircle2,
} from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "pre-primary", label: "Pre-Primary" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "higher-secondary", label: "Higher Secondary" },
];

const SECTION_OPTIONS = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
  { value: "D", label: "Section D" },
];

const CAPACITY_OPTIONS = [
  { value: "small", label: "Small", sub: "1 – 20 seats" },
  { value: "medium", label: "Medium", sub: "21 – 40 seats" },
  { value: "large", label: "Large", sub: "41+ seats" },
];

const STUDENT_COUNT_OPTIONS = [
  { value: "empty", label: "Empty", sub: "0 students" },
  { value: "small", label: "Small", sub: "1 – 15 students" },
  { value: "medium", label: "Medium", sub: "16 – 30 students" },
  { value: "large", label: "Large", sub: "30+ students" },
];

const AVAILABILITY_OPTIONS = [
  { value: "available", label: "Available", sub: "Seats remaining" },
  { value: "full", label: "Full", sub: "No seats left" },
];

export interface ClassFilterValues {
  search: string;
  type: string;
  availability?: string;
  section?: string;
  capacity?: string;
  studentCount?: string;
}

interface ClassFiltersProps {
  filters: ClassFilterValues;
  onFiltersChange: (filters: ClassFilterValues) => void;
  onClearFilters: () => void;
}

export default function ClassFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: ClassFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    !!filters.availability ||
    !!filters.section ||
    !!filters.capacity ||
    !!filters.studentCount;

  const activeFilterCount = [
    filters.availability,
    filters.section,
    filters.capacity,
    filters.studentCount,
  ].filter(Boolean).length;

  const handleCheckbox = (
    key: keyof ClassFilterValues,
    value: string,
    checked: boolean,
  ) => {
    onFiltersChange({
      ...filters,
      [key]: checked ? value : undefined,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mt-6">
        {/* Class Type Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {TYPE_OPTIONS.map(t => (
            <button
              key={t.value}
              onClick={() => onFiltersChange({ ...filters, type: t.value })}
              className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
                filters.type === t.value
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              }`}
              style={
                filters.type === t.value
                  ? {
                      background: "var(--grad-primary)",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
                {activeFilterCount}
              </span>
            )}
            <ChevronRight size={16} className={isOpen ? "rotate-90" : ""} />
          </button>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              type="text"
              placeholder="Search classes..."
              value={filters.search}
              onChange={e =>
                onFiltersChange({ ...filters, search: e.target.value })
              }
              className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed right-0 top-0 h-full w-96 bg-[var(--surface)] border-l border-[var(--border)] shadow-[var(--shadow-lg)] z-50 overflow-y-auto">
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--text)]">
                  Filters
                </h2>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={onClearFilters}
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

            <div className="p-4 space-y-4">
              {/* Availability */}
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <CheckCircle2 size={16} />
                  Availability
                </label>
                <div className="space-y-1">
                  {AVAILABILITY_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`avail-${opt.value}`}
                        checked={filters.availability === opt.value}
                        onChange={e =>
                          handleCheckbox(
                            "availability",
                            opt.value,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`avail-${opt.value}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <span className="text-xs text-[var(--text-3)] ml-2">
                          {opt.sub}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section */}
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Layers size={16} />
                  Section
                </label>
                <div className="space-y-1">
                  {SECTION_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`section-${opt.value}`}
                        checked={filters.section === opt.value}
                        onChange={e =>
                          handleCheckbox("section", opt.value, e.target.checked)
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`section-${opt.value}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1"
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Capacity */}
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Users size={16} />
                  Capacity
                </label>
                <div className="space-y-1">
                  {CAPACITY_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`cap-${opt.value}`}
                        checked={filters.capacity === opt.value}
                        onChange={e =>
                          handleCheckbox(
                            "capacity",
                            opt.value,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`cap-${opt.value}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <span className="text-xs text-[var(--text-3)] ml-2">
                          {opt.sub}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Count */}
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <CircleDot size={16} />
                  Student Count
                </label>
                <div className="space-y-1">
                  {STUDENT_COUNT_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`sc-${opt.value}`}
                        checked={filters.studentCount === opt.value}
                        onChange={e =>
                          handleCheckbox(
                            "studentCount",
                            opt.value,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`sc-${opt.value}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1 flex items-center justify-between"
                      >
                        <span>{opt.label}</span>
                        <span className="text-xs text-[var(--text-3)] ml-2">
                          {opt.sub}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
