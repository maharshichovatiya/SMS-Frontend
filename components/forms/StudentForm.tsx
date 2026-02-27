"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Users,
  DollarSign,
  Heart,
  Hash,
} from "lucide-react";
import {
  createStudentSchema,
  updateStudentSchema,
  StudentFormValues,
  STUDENT_FIELDS,
} from "@/lib/validations/StudentSchema";
import { studentApis } from "@/lib/api/Student";
import { showToast } from "@/lib/utils/Toast";
import DateInput from "@/components/ui/DateInput";

interface StudentFormProps {
  initialData?: Partial<StudentFormValues> & { id?: string };
  onSubmitSuccess?: () => void;
  onClose: () => void;
  roleId: string;
}

export default function StudentForm({
  initialData,
  onSubmitSuccess,
  onClose,
  roleId,
}: StudentFormProps) {
  const isEditMode = !!initialData;

  // Icon mapping for different fields
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "firstName":
      case "middleName":
      case "lastName":
        return User;
      case "email":
        return Mail;
      case "phone":
      case "fatherPhone":
        return Phone;
      case "admissionDate":
        return Calendar;
      case "password":
        return Lock;
      case "fatherName":
      case "motherName":
      case "guardianName":
        return Users;
      case "familyAnnualIncome":
        return DollarSign;
      case "medicalConditions":
        return Heart;
      case "admissionNo":
      case "rollNo":
        return Hash;
      default:
        return User;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(
      isEditMode ? updateStudentSchema : createStudentSchema,
    ),
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
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      guardianName: "",
      familyAnnualIncome: "",
      medicalConditions: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        showToast.error("School ID not found. Please login again.");
        return;
      }

      if (isEditMode) {
        if (!initialData?.id) {
          showToast.error("Student ID is required for update");
          return;
        }
        await studentApis.updateStudent(initialData.id, data);
        showToast.success("Student updated successfully!");
      } else {
        const payload = {
          ...data,
          roleId,
          schoolId,
        };
        await studentApis.addStudent(payload);
        showToast.success("Student admitted successfully!");
      }

      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 auto-rows-auto">
        {STUDENT_FIELDS.filter(
          field => !(isEditMode && field.name === "password"),
        ).map((field, index, filteredFields) => {
          const error = errors[field.name];
          const isLastField = index === filteredFields.length - 1;
          if (field.type === "date") {
            return (
              <div
                key={field.name}
                className={
                  isLastField
                    ? "md:col-span-1 col-span-1"
                    : field.name === "email" ||
                        field.name === "password" ||
                        field.name === "lastName"
                      ? "md:col-span-2 col-span-1"
                      : "md:col-span-1 col-span-1"
                }
              >
                <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                  {field.label}
                  {!field.optional && (
                    <span className="text-[var(--rose)] ml-0.5">*</span>
                  )}
                </label>
                <div className="relative">
                  <DateInput
                    {...register(field.name)}
                    error={error?.message}
                    icon={false}
                    className="w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)]"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={field.name}
              className={
                isLastField
                  ? "md:col-span-1 col-span-1"
                  : field.name === "email" ||
                      field.name === "password" ||
                      field.name === "lastName"
                    ? "md:col-span-2 col-span-1"
                    : "md:col-span-1 col-span-1"
              }
            >
              <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                {field.label}
                {!field.optional && (
                  <span className="text-[var(--rose)] ml-0.5">*</span>
                )}
              </label>
              <div className="relative">
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                    error
                      ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                      : "border-[var(--border)]"
                  }`}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                  {(() => {
                    const Icon = getFieldIcon(field.name);
                    return <Icon className="w-4 h-4" />;
                  })()}
                </div>
              </div>
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
          className="px-5 cursor-pointer py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-[52px]"
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
