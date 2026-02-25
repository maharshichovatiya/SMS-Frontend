"use client";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormData, classSchema } from "@/lib/validations/classForm";
import { useEffect, useState } from "react";
import { getAllTeachers } from "@/lib/api/teacher";
import { GetTeachers } from "@/lib/types/teacher";
import toast from "react-hot-toast";
import { createClass, updateClass } from "@/lib/api/classes";

interface ClassFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  defaultValues?: Partial<ClassFormData>;
  mode?: "add" | "edit";
  classId?: string;
}

export default function ClassForm({
  onCancel,
  onSuccess,
  defaultValues,
  mode = "add",
  classId,
}: ClassFormProps) {
  const [teachers, setTeachers] = useState<GetTeachers[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema) as Resolver<ClassFormData>,
    defaultValues,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAllTeachers();

        if (res.success && res.data) {
          setTeachers(res.data);
        } else {
          toast.error(res.message || "Failed to load teachers");
        }
      } catch {
        toast.error("Failed to load teachers");
      } finally {
        setLoadingTeachers(false);
      }
    };
    load();
  }, []);

  const onSubmit: SubmitHandler<ClassFormData> = async data => {
    setSubmitting(true);
    try {
      const res =
        mode === "edit" && classId
          ? await updateClass(classId, data)
          : await createClass(data);

      if (res.success) {
        toast.success(
          mode === "edit"
            ? "Class updated successfully"
            : "Class created successfully",
        );
        reset();
        onSuccess?.();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full sm:w-[480px]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">Class No</label>
          <input
            {...register("classNo")}
            placeholder="e.g. 10"
            className={`input-base pl-4 ${errors.classNo ? "error" : ""}`}
          />
          {errors.classNo && (
            <span className="text-xs text-[var(--rose)]">
              {errors.classNo.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">Section</label>
          <input
            {...register("section")}
            placeholder="e.g. A"
            className={`input-base pl-4 ${errors.section ? "error" : ""}`}
          />
          {errors.section && (
            <span className="text-xs text-[var(--rose)]">
              {errors.section.message}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="label-base">Student Capacity</label>
        <input
          {...register("studentCapacity")}
          type="number"
          placeholder="e.g. 60"
          className={`input-base pl-4 ${errors.studentCapacity ? "error" : ""}`}
        />
        {errors.studentCapacity && (
          <span className="text-xs text-[var(--rose)]">
            {errors.studentCapacity.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="label-base">Class Teacher</label>

        {loadingTeachers ? (
          <div className="input-base pl-4 flex items-center gap-2 text-[var(--text-3)] animate-pulse">
            <svg
              className="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Loading teachers...
          </div>
        ) : teachers.length === 0 ? (
          <div
            className={`input-base pl-4 flex items-center text-[var(--text-3)] text-sm`}
          >
            No teachers found
          </div>
        ) : (
          <select
            {...register("classTeacherId")}
            className={`input-base pl-4 appearance-none ${errors.classTeacherId ? "error" : ""}`}
          >
            <option value="">Select a teacher</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.user.firstName} {teacher.user.lastName} —{" "}
                {teacher.designation}
              </option>
            ))}
          </select>
        )}

        {errors.classTeacherId && (
          <span className="text-xs text-[var(--rose)]">
            {errors.classTeacherId.message}
          </span>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] font-medium hover:bg-[var(--bg-2)] transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || loadingTeachers || teachers.length === 0}
          className="btn-primary disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Update Class"
              : "Save Class"}
        </button>
      </div>
    </form>
  );
}
