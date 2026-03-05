"use client";

import React, { useState, useEffect } from "react";
import {
  Filter,
  X,
  Calendar,
  Users,
  GraduationCap,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { classApis, Class, AcademicYear } from "@/lib/api/Class";
import { showToast } from "@/lib/utils/Toast";
import FiltersLoadingSkeleton from "@/components/skeletons/FiltersLoadingSkeleton";

interface StudentFiltersProps {
  filters: {
    classId?: string;
    academicYearId?: string;
    gender?: string;
    fromDate?: string;
    toDate?: string;
    fromFamilyIncome?: string;
    toFamilyIncome?: string;
  };
  onFiltersChange: (filters: StudentFiltersProps["filters"]) => void;
  onClearFilters: () => void;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

export default function StudentFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: StudentFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);

  const hasActiveFilters = Object.values(filters).some(
    value => value !== undefined && value !== "",
  );

  useEffect(() => {
    if (isOpen) {
      fetchFilterData();
    }
  }, [isOpen]);

  const fetchFilterData = async () => {
    try {
      setLoading(true);
      const [classesData, academicYearsData] = await Promise.all([
        classApis.getAll(),
        classApis.getAcademicYears(),
      ]);
      setClasses(classesData);
      setAcademicYears(academicYearsData);
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (
    type: "fromDate" | "toDate" | "fromFamilyIncome" | "toFamilyIncome",
    value: string,
  ) => {
    onFiltersChange({
      ...filters,
      [type]: value || undefined,
    });
  };

  const handleCheckboxChange = (
    filterName: keyof StudentFiltersProps["filters"],
    value: string,
    checked: boolean,
  ) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        [filterName]: value,
      });
    } else {
      onFiltersChange({
        ...filters,
        [filterName]: undefined,
      });
    }
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

            {/* Content */}
            <div className="p-4">
              {loading ? (
                <FiltersLoadingSkeleton />
              ) : (
                <div className="space-y-6">
                  {/* Class Filter */}
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                      <Users size={16} />
                      Class
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {classes.map(cls => (
                        <div
                          key={cls.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-3)] transition-colors duration-[var(--duration)]"
                        >
                          <input
                            type="checkbox"
                            id={`class-${cls.id}`}
                            checked={filters.classId === cls.id}
                            onChange={e =>
                              handleCheckboxChange(
                                "classId",
                                cls.id,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                          />
                          <label
                            htmlFor={`class-${cls.id}`}
                            className="text-sm text-[var(--text)] cursor-pointer hover:text-[var(--text-2)] transition-colors duration-[var(--duration)] flex-1"
                          >
                            Class {cls.classNo}-{cls.section}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Year Filter */}
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                      <GraduationCap size={16} />
                      Academic Year
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {academicYears.map(year => (
                        <div
                          key={year.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-3)] transition-colors duration-[var(--duration)]"
                        >
                          <input
                            type="checkbox"
                            id={`year-${year.id}`}
                            checked={filters.academicYearId === year.id}
                            onChange={e =>
                              handleCheckboxChange(
                                "academicYearId",
                                year.id,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                          />
                          <label
                            htmlFor={`year-${year.id}`}
                            className="text-sm text-[var(--text)] cursor-pointer hover:text-[var(--text-2)] transition-colors duration-[var(--duration)] flex-1"
                          >
                            {year.yearName}
                            {year.isCurrent && (
                              <span className="ml-2 text-xs text-[var(--blue)] font-medium bg-[var(--blue-light)] px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Filter */}
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                      <Users size={16} />
                      Gender
                    </label>
                    <div className="space-y-2">
                      {GENDER_OPTIONS.map(option => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--surface-3)] transition-colors duration-[var(--duration)]"
                        >
                          <input
                            type="checkbox"
                            id={`gender-${option.value}`}
                            checked={filters.gender === option.value}
                            onChange={e =>
                              handleCheckboxChange(
                                "gender",
                                option.value,
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4 text-[var(--blue)] border-[var(--border)] rounded focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                          />
                          <label
                            htmlFor={`gender-${option.value}`}
                            className="text-sm text-[var(--text)] cursor-pointer hover:text-[var(--text-2)] transition-colors duration-[var(--duration)] flex-1"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date Range Filter */}
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                      <Calendar size={16} />
                      Admission Date Range
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                          From Date
                        </label>
                        <input
                          type="date"
                          value={filters.fromDate || ""}
                          onChange={e =>
                            handleDateRangeChange("fromDate", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)] cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                          To Date
                        </label>
                        <input
                          type="date"
                          value={filters.toDate || ""}
                          onChange={e =>
                            handleDateRangeChange("toDate", e.target.value)
                          }
                          className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Family Income Range Filter */}
                  <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)] mb-4">
                      <IndianRupee size={16} />
                      Family Annual Income Range
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                          From Income (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 70000"
                          value={filters.fromFamilyIncome || ""}
                          onChange={e =>
                            handleDateRangeChange(
                              "fromFamilyIncome",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--text-3)] mb-1 block font-medium">
                          To Income (₹)
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 90000"
                          value={filters.toFamilyIncome || ""}
                          onChange={e =>
                            handleDateRangeChange(
                              "toFamilyIncome",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] outline-none transition-colors duration-[var(--duration)]"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
