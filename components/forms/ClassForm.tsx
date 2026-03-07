"use client";

import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassFormData, classSchema } from "@/lib/validations/ClassSchema";
import { useEffect, useState } from "react";
import { getTeachersForAssignClass } from "@/lib/api/Teacher";
import { showToast } from "@/lib/utils/Toast";
import { createClass, updateClass } from "@/lib/api/Classes";
import { Hash, ChevronDown, Users, GraduationCap } from "lucide-react";

interface AssignTeacher {
  id: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    school: {
      id: string;
      name: string;
    };
  };
}

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
  const [teachers, setTeachers] = useState<AssignTeacher[]>([]);
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
    mode: "onSubmit",
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        className: String(defaultValues.className ?? ""),
        section: defaultValues.section ?? "",
        classTeacherId: defaultValues.classTeacherId ?? null,
        studentCapacity: defaultValues.studentCapacity ?? undefined,
      });
    }
  }, [defaultValues]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTeachersForAssignClass();
        if (res.success && res.data) {
          setTeachers(res.data);
        } else {
          showToast.error(res.message || "Something went wrong");
        }
      } catch {
        showToast.error("Failed to load teachers");
      } finally {
        setLoadingTeachers(false);
      }
    };
    load();
  }, []);

  const onSubmit: SubmitHandler<ClassFormData> = async data => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        classTeacherId: data.classTeacherId || null,
      };

      const res =
        mode === "edit" && classId
          ? await updateClass(classId, payload)
          : await createClass(payload);

      if (res.success) {
        showToast.success(
          mode === "edit"
            ? "Class updated successfully"
            : "Class created successfully",
        );
        reset();
        onSuccess?.();
      } else {
        showToast.error(res.message || "Something went wrong");
      }
    } catch {
      showToast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full sm:w-[480px]"
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="section-label">Class Info</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-base">
              Class Name <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <Hash
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <select
                {...register("className")}
                className={`input-base pl-9 pr-9 appearance-none ${errors.className ? "error" : ""}`}
              >
                <option value="">Select class</option>
                <option value="LKG">class LKG</option>
                <option value="UKG">class UKG</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={String(num)}>
                    class {num}
                  </option>
                ))}
                <option value="11-science">class 11 Science</option>
                <option value="11-commerce">class 11 Commerce</option>
                <option value="12-science">class 12 Science</option>
                <option value="12-commerce">class 12 Commerce</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.className?.message}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">
              Section <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <GraduationCap
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <select
                {...register("section")}
                className={`input-base pl-9 pr-9 appearance-none ${errors.section ? "error" : ""}`}
              >
                <option value="">Select section</option>
                {["A", "B", "C", "D"].map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.section?.message}
            </span>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="section-label">Capacity & Teacher</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-base">
              Student Capacity <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <Users
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("studentCapacity")}
                type="number"
                placeholder="e.g. 60"
                onKeyDown={e => {
                  if (["e", "E", "+", "-", "."].includes(e.key))
                    e.preventDefault();
                }}
                className={`input-base pl-9 ${errors.studentCapacity ? "error" : ""}`}
              />
            </div>
            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.studentCapacity?.message}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Class Teacher</label>

            {loadingTeachers ? (
              <div className="input-base pl-9 flex items-center gap-2 text-[var(--text-3)] animate-pulse">
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
              <div className="input-base pl-9 flex items-center text-[var(--text-3)] text-sm">
                No teachers found
              </div>
            ) : (
              <div className="relative">
                <GraduationCap
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-3)" }}
                />
                <select
                  {...register("classTeacherId")}
                  className={`input-base pl-9 pr-9 appearance-none ${errors.classTeacherId ? "error" : ""}`}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user.firstName} {teacher.user.lastName} —{" "}
                      {teacher.designation}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  style={{ color: "var(--text-3)" }}
                />
              </div>
            )}

            <span className="text-xs text-[var(--rose)] min-h-[16px]">
              {errors.classTeacherId?.message}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-7 py-3 cursor-pointer rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-2)] font-medium hover:bg-[var(--bg-2)] transition"
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
