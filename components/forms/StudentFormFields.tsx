"use client";

import React from "react";
import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Heart,
  Hash,
  IndianRupee,
  Building,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import {
  StudentFormValues,
  STUDENT_FIELDS,
} from "@/lib/validations/StudentSchema";
import { Class, AcademicYear } from "@/lib/api/Class";
import DateInput from "@/components/ui/DateInput";

interface StudentFormFieldsProps {
  register: UseFormRegister<StudentFormValues>;
  watch: UseFormWatch<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  academicYears: AcademicYear[];
  filteredClasses: Class[];
  selectedAcademicYear: string;
  fetchingData: boolean;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleGeneratePassword: () => void;
  handleAcademicYearChange: (academicYearId: string) => void;
  isEditMode: boolean;
  initialData?: Partial<StudentFormValues> & {
    id?: string;
    classId?: string;
    academicYearId?: string;
    isAssigned?: boolean;
    className?: string;
    user?: {
      gender?: string;
    };
  };
}

// Icon mapping for different fields
const getFieldIcon = (fieldName: string) => {
  switch (fieldName) {
    case "firstName":
    case "middleName":
    case "lastName":
    case "gender":
      return Users;
    case "email":
      return Mail;
    case "phone":
    case "fatherPhone":
      return Phone;
    case "admissionDate":
      return Calendar;
    case "fatherName":
    case "motherName":
    case "guardianName":
      return Users;
    case "familyAnnualIncome":
      return IndianRupee;
    case "medicalConditions":
      return Heart;
    case "bloodGroup":
      return Heart;
    case "bankName":
    case "branch":
      return Building;
    case "accountNo":
    case "ifscCode":
      return CreditCard;
    case "admissionNo":
    case "rollNo":
      return Hash;
    default:
      return User;
  }
};

export default function StudentFormFields({
  register,
  watch,
  errors,
  academicYears,
  filteredClasses,
  selectedAcademicYear,
  fetchingData,
  showPassword,
  setShowPassword,
  handleGeneratePassword,
  handleAcademicYearChange,
  isEditMode,
  initialData,
}: StudentFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 auto-rows-auto">
      {(() => {
        const filteredFields = STUDENT_FIELDS;

        const fieldsBySection = filteredFields.reduce(
          (acc, field) => {
            const section = field.section || "Other";
            if (!acc[section]) acc[section] = [];
            acc[section].push(field);
            return acc;
          },
          {} as Record<string, typeof filteredFields>,
        );

        return Object.entries(fieldsBySection).map(([section, fields]) => (
          <React.Fragment key={section}>
            {/* Section Header */}
            <div className="md:col-span-2 col-span-1">
              <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
                {section}
              </h3>
            </div>

            {/* Section Fields */}
            {fields.map(field => {
              const error = errors[field.name];
              const isFullWidth = field.fullWidth;

              if (field.type === "date") {
                return (
                  <div
                    key={field.name}
                    className={
                      isFullWidth
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
                        id={field.name}
                        error={error?.message}
                        className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)]"
                      />
                    </div>
                  </div>
                );
              }

              if (field.type === "classAssignment") {
                return (
                  <div
                    key={field.name}
                    className={
                      isFullWidth
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
                      <div className="group relative">
                        <select
                          {...register(field.name, {
                            onChange: e => {
                              if (field.name === "academicYearId") {
                                handleAcademicYearChange(e.target.value);
                              }
                            },
                          })}
                          disabled={
                            fetchingData ||
                            (field.name === "classId" && !selectedAcademicYear)
                          }
                          className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] disabled:opacity-50 cursor-pointer ${
                            error
                              ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                              : "border-[var(--border)]"
                          }`}
                        >
                          <option value="">
                            {fetchingData ? "Loading..." : field.placeholder}
                          </option>
                          {field.name === "academicYearId" &&
                            academicYears.map(year => (
                              <option key={year.id} value={year.id}>
                                {year.yearName} {year.isCurrent && "(Current)"}{" "}
                                - {year.status}
                              </option>
                            ))}
                          {field.name === "classId" &&
                            filteredClasses.map(cls => (
                              <option key={cls.id} value={cls.id}>
                                Class {cls.className} - {cls.section}
                                {cls.studentCapacity &&
                                  ` (Capacity: ${cls.studentCapacity})`}
                                {cls.status === "inactive" && " (Inactive)"}
                              </option>
                            ))}
                        </select>
                        {field.name === "classId" && !selectedAcademicYear && (
                          <div className="absolute bottom-full left-0 mb-2 px-3 py-1 text-xs text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Select academic year first
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--border)]"></div>
                          </div>
                        )}
                      </div>
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    {error && (
                      <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              }

              if (field.type === "password") {
                return (
                  <div
                    key={field.name}
                    className={
                      isFullWidth
                        ? "md:col-span-2 col-span-1"
                        : "md:col-span-1 col-span-1"
                    }
                  >
                    <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                      {field.label}
                      {!field.optional &&
                        !(isEditMode && field.name === "password") && (
                          <span className="text-[var(--rose)] ml-0.5">*</span>
                        )}
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                        style={{ color: "var(--text-3)" }}
                      />
                      <input
                        {...register(field.name)}
                        type={showPassword ? "text" : "password"}
                        placeholder={
                          isEditMode && field.name === "password"
                            ? "Leave blank to keep current"
                            : field.placeholder
                        }
                        className={`w-full px-3.5 py-2.5 pl-9 pr-20 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                          error
                            ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                            : "border-[var(--border)]"
                        }`}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleGeneratePassword}
                          className="p-1.5 cursor-pointer text-[var(--blue)] hover:bg-[var(--blue-light)] rounded-[var(--radius-sm)] transition-colors"
                          title="Generate password"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {error && (
                      <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              }

              if (field.type === "select") {
                return (
                  <div
                    key={field.name}
                    className={
                      isFullWidth
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
                      <select
                        {...register(field.name)}
                        value={(watch(field.name) as string) || ""}
                        className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer ${
                          error
                            ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                            : "border-[var(--border)]"
                        }`}
                      >
                        {/* Hide placeholder if in edit mode and gender already exists in original data */}
                        {!(
                          isEditMode &&
                          (field.name === "gender" ||
                            field.name === "bloodGroup") &&
                          (initialData?.gender || initialData?.bloodGroup)
                        ) && (
                          <option value="">
                            {field.name === "gender"
                              ? "Select gender"
                              : field.name === "bloodGroup"
                                ? "Select blood group"
                                : field.placeholder}
                          </option>
                        )}
                        {field.name === "gender" ? (
                          <>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </>
                        ) : field.name === "bloodGroup" ? (
                          <>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </>
                        ) : null}
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    {error && (
                      <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                        {error.message}
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={field.name}
                  className={
                    isFullWidth
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
                      type={
                        field.type === "tel"
                          ? "tel"
                          : field.name === "rollNo" ||
                              field.name === "aadhaarNo" ||
                              field.name === "accountNo"
                            ? "number"
                            : field.type
                      }
                      placeholder={field.placeholder}
                      {...register(field.name)}
                      className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                        error
                          ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                          : "border-[var(--border)]"
                      }`}
                      onInput={
                        field.type === "tel" || field.name.includes("phone")
                          ? e => {
                              const value = e.currentTarget.value;
                              // Only allow numbers, max 10 digits
                              const numericValue = value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              if (value !== numericValue) {
                                e.currentTarget.value = numericValue;
                              }
                            }
                          : field.name === "aadhaarNo"
                            ? e => {
                                const value = e.currentTarget.value;
                                // Only allow numbers, max 12 digits
                                const numericValue = value
                                  .replace(/\D/g, "")
                                  .slice(0, 12);
                                if (value !== numericValue) {
                                  e.currentTarget.value = numericValue;
                                }
                              }
                            : field.name === "rollNo"
                              ? e => {
                                  const value = e.currentTarget.value;
                                  // Only allow numbers
                                  const numericValue = value.replace(/\D/g, "");
                                  if (value !== numericValue) {
                                    e.currentTarget.value = numericValue;
                                  }
                                }
                              : field.name === "familyAnnualIncome"
                                ? e => {
                                    const value = e.currentTarget.value;
                                    // Only allow numbers
                                    const numericValue = value.replace(
                                      /\D/g,
                                      "",
                                    );
                                    if (value !== numericValue) {
                                      e.currentTarget.value = numericValue;
                                    }
                                  }
                                : undefined
                      }
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
          </React.Fragment>
        ));
      })()}
    </div>
  );
}
