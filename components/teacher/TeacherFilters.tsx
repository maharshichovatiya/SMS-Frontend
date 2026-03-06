"use client";

import React, { useState } from "react";
import {
  Filter,
  X,
  Search,
  ChevronRight,
  Users,
  Briefcase,
  Clock,
  UserCheck,
  Building2,
  IndianRupee,
} from "lucide-react";
import {
  AGE_OPTIONS,
  DEPARTMENTS,
  EXPERIENCE_OPTIONS,
  GENDER_OPTIONS,
  SALARY_OPTIONS,
  STATUS_OPTIONS,
  TENURE_OPTIONS,
} from "@/lib/utils/TeacherFilterConstants";

export interface TeacherFilterValues {
  search: string;
  department: string[];
  experience?: string[];
  salary?: string[];
  ageGroup?: string[];
  tenure?: string[];
  gender?: string[];
  status?: string[];
}

interface TeacherFiltersProps {
  filters: TeacherFilterValues;
  onFiltersChange: (filters: TeacherFilterValues) => void;
  onClearFilters: () => void;
}

export default function TeacherFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: TeacherFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    (filters.department?.length ?? 0) > 0 ||
    (filters.experience?.length ?? 0) > 0 ||
    (filters.salary?.length ?? 0) > 0 ||
    (filters.ageGroup?.length ?? 0) > 0 ||
    (filters.tenure?.length ?? 0) > 0 ||
    (filters.gender?.length ?? 0) > 0;

  const activeFilterCount = [
    ...(filters.department ?? []),
    ...(filters.experience ?? []),
    ...(filters.salary ?? []),
    ...(filters.ageGroup ?? []),
    ...(filters.tenure ?? []),
    ...(filters.gender ?? []),
  ].filter(Boolean).length;

  const handleCheckbox = (
    key: keyof TeacherFilterValues,
    value: string,
    checked: boolean,
  ) => {
    const current = (filters[key] as string[]) ?? [];
    onFiltersChange({
      ...filters,
      [key]: checked ? [...current, value] : current.filter(v => v !== value),
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onFiltersChange({ ...filters, status: [] })}
            className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
              !filters.status?.length
                ? "text-white border-transparent"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
            }`}
            style={
              !filters.status?.length
                ? {
                    background: "var(--grad-primary)",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            All
          </button>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s.value}
              onClick={() =>
                onFiltersChange({
                  ...filters,
                  status: filters.status?.includes(s.value)
                    ? filters.status.filter(v => v !== s.value)
                    : [...(filters.status ?? []), s.value],
                })
              }
              className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
                filters.status?.includes(s.value)
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              }`}
              style={
                filters.status?.includes(s.value)
                  ? {
                      background: "var(--grad-primary)",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {s.label}
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
              placeholder="Search teachers..."
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
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Building2 size={16} />
                  Department
                </label>
                <div className="space-y-1">
                  {DEPARTMENTS.filter(d => d.key !== "all").map(opt => (
                    <div
                      key={opt.key}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`dept-${opt.key}`}
                        checked={(filters.department ?? []).includes(opt.key)}
                        onChange={e =>
                          handleCheckbox(
                            "department",
                            opt.key,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`dept-${opt.key}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1"
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Briefcase size={16} />
                  Experience
                </label>
                <div className="space-y-1">
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`exp-${opt.value}`}
                        checked={(filters.experience ?? []).includes(opt.value)}
                        onChange={e =>
                          handleCheckbox(
                            "experience",
                            opt.value,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`exp-${opt.value}`}
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

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <IndianRupee size={16} />
                  Salary Package
                </label>
                <div className="space-y-1">
                  {SALARY_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`sal-${opt.value}`}
                        checked={(filters.salary ?? []).includes(opt.value)}
                        onChange={e =>
                          handleCheckbox("salary", opt.value, e.target.checked)
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`sal-${opt.value}`}
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

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Users size={16} />
                  Age Group
                </label>
                <div className="space-y-1">
                  {AGE_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`age-${opt.value}`}
                        checked={(filters.ageGroup ?? []).includes(opt.value)}
                        onChange={e =>
                          handleCheckbox(
                            "ageGroup",
                            opt.value,
                            e.target.checked,
                          )
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`age-${opt.value}`}
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

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <Clock size={16} />
                  Joining Tenure
                </label>
                <div className="space-y-1">
                  {TENURE_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`tenure-${opt.value}`}
                        checked={(filters.tenure ?? []).includes(opt.value)}
                        onChange={e =>
                          handleCheckbox("tenure", opt.value, e.target.checked)
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`tenure-${opt.value}`}
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

              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-3">
                  <UserCheck size={16} />
                  Gender
                </label>
                <div className="space-y-1">
                  {GENDER_OPTIONS.map(opt => (
                    <div
                      key={opt.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors duration-[var(--duration)]"
                    >
                      <input
                        type="checkbox"
                        id={`gender-${opt.value}`}
                        checked={(filters.gender ?? []).includes(opt.value)}
                        onChange={e =>
                          handleCheckbox("gender", opt.value, e.target.checked)
                        }
                        className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                      />
                      <label
                        htmlFor={`gender-${opt.value}`}
                        className="text-sm text-[var(--text)] cursor-pointer flex-1"
                      >
                        {opt.label}
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
