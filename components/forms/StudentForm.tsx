"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStudentSchema,
  CreateStudentFormValues,
  STUDENT_FIELDS,
} from "@/lib/validations/studentSchema";

interface StudentFormProps {
  initialData?: Partial<CreateStudentFormValues>;
  onSubmitSuccess?: () => void;
  onclose: () => void;
}

export default function StudentForm({
  initialData,
  onSubmitSuccess,
  onclose,
}: StudentFormProps) {
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      admissionNo: "",
      rollNo: "",
      admissionDate: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreateStudentFormValues) => {
    if (isEditMode) {
      //  await fetch(`/api/students/${id}`, { method: "PUT", body: JSON.stringify(data) })
    } else {
      // await fetch("/api/students", { method: "POST", body: JSON.stringify(data) })
    }
    onSubmitSuccess?.();
  };

  const handleCancel = () => {
    reset();
    onclose();
    //router.back() or router.push("/students")
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {STUDENT_FIELDS.map(field => {
          const error = errors[field.name];

          if (isEditMode && field.name === "password") return null;

          return (
            <div
              key={field.name}
              className={field.fullWidth ? "col-span-2" : "col-span-1"}
            >
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                {field.label}
                {!field.optional && (
                  <span className="text-[var(--rose)] ml-0.5">*</span>
                )}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name)}
                className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                  error
                    ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                    : "border-[var(--border)]"
                }`}
              />
              {error && (
                <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                  {error.message}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Student"
              : "Admit Student"}
        </button>
      </div>
    </form>
  );
}
