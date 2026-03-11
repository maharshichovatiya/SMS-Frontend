"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classApis } from "@/lib/api/Class";
import { showToast } from "@/lib/utils/Toast";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStudentFiltersData,
  selectStudentFiltersLoading,
  fetchStudentFilterData,
} from "@/lib/store/StudentFiltersSlice";
import type { AppDispatch } from "@/lib/store/Index";

const classAssignmentSchema = z.object({
  classId: z.string().min(1, "Please select a class"),
  academicYearId: z.string().min(1, "Please select an academic year"),
});

type ClassAssignmentValues = z.infer<typeof classAssignmentSchema>;

interface ClassAssignmentFormProps {
  studentId: string;
  currentClassId?: string;
  currentAcademicYearId?: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export default function ClassAssignmentForm({
  studentId,
  currentClassId,
  currentAcademicYearId,
  onSubmitSuccess,
  onCancel,
}: ClassAssignmentFormProps) {
  // Get classes and academic years from Redux
  const { classes, academicYears } = useSelector(selectStudentFiltersData);
  const filtersLoading = useSelector(selectStudentFiltersLoading);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClassAssignmentValues>({
    resolver: zodResolver(classAssignmentSchema),
    defaultValues: {
      classId: currentClassId || "",
      academicYearId: currentAcademicYearId || "",
    },
  });

  const selectedAcademicYearId = watch("academicYearId");

  // Fetch filter data if not available
  useEffect(() => {
    if (classes.length === 0 && academicYears.length === 0 && !filtersLoading) {
      dispatch(fetchStudentFilterData());
    }
  }, [classes.length, academicYears.length, filtersLoading, dispatch]);

  // Set current academic year if provided and no academic year is selected
  useEffect(() => {
    if (currentAcademicYearId && !selectedAcademicYearId) {
      const currentYear = academicYears.find(year => year.isCurrent);
      if (currentYear) {
        setValue("academicYearId", currentYear.id);
      }
    }
  }, [currentAcademicYearId, selectedAcademicYearId, setValue, academicYears]);

  // Show loading state while fetching data
  if (filtersLoading || (classes.length === 0 && academicYears.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-sm text-[var(--text-3)]">
          Loading classes and academic years...
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ClassAssignmentValues) => {
    try {
      setLoading(true);
      await classApis.assignStudentToClass(
        studentId,
        data.classId,
        data.academicYearId,
      );
      showToast.success("Class assigned successfully!");
      onSubmitSuccess?.();
    } catch (error) {
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  };

  const selectedClass = classes.find(cls => cls.id === watch("classId"));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Academic Year <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <select
            {...register("academicYearId")}
            disabled={loading}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] disabled:opacity-50 cursor-pointer ${
              errors.academicYearId
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          >
            <option value="">Select Academic Year</option>
            {academicYears.map(year => (
              <option key={year.id} value={year.id}>
                {year.yearName} {year.isCurrent && "(Current)"} - {year.status}
              </option>
            ))}
          </select>
          {errors.academicYearId && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.academicYearId.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
            Class <span className="text-[var(--rose)] ml-0.5">*</span>
          </label>
          <select
            {...register("classId")}
            disabled={loading}
            className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] disabled:opacity-50 cursor-pointer ${
              errors.classId
                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                : "border-[var(--border)]"
            }`}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>
                Class {cls.className} - {cls.section}
                {cls.studentCapacity && ` (Capacity: ${cls.studentCapacity})`}
                {cls.status === "inactive" && " (Inactive)"}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="mt-1 text-xs font-medium text-[var(--rose)]">
              {errors.classId.message}
            </p>
          )}
        </div>

        {selectedClass && (
          <div className="p-3 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-2">
              Class Information
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-3)]">Class Number:</span>
                <span className="text-[var(--text)] font-medium">
                  {selectedClass.className}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-3)]">Section:</span>
                <span className="text-[var(--text)] font-medium">
                  {selectedClass.section}
                </span>
              </div>
              {selectedClass.studentCapacity && (
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-3)]">Capacity:</span>
                  <span className="text-[var(--text)] font-medium">
                    {selectedClass.studentCapacity} students
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-3)]">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedClass.status === "active"
                      ? "bg-[var(--green-light)] text-[var(--green)]"
                      : "bg-[var(--rose-light)] text-[var(--rose)]"
                  }`}
                >
                  {selectedClass.status}
                </span>
              </div>
              {selectedClass.classTeacher && (
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-3)]">Class Teacher:</span>
                  <span className="text-[var(--text)] font-medium">
                    {selectedClass.classTeacher.name}
                  </span>
                </div>
              )}
            </div>
            {selectedClass.status === "inactive" && (
              <div className="mt-2 p-2 bg-[var(--amber-light)] border border-[var(--amber)] rounded-[var(--radius-sm)]">
                <p className="text-xs text-[var(--amber)] font-medium">
                  ⚠️ This class is currently inactive
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 cursor-pointer py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)]"
          style={{ height: "52px" }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Assigning..." : "Assign Class"}
        </button>
      </div>
    </form>
  );
}
