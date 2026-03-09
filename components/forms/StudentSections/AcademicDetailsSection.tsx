import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StudentFormValues } from "@/lib/validations/StudentSchema";
import { STUDENT_FIELDS } from "@/lib/validations/StudentSchema";
import DateInput from "@/components/ui/DateInput";
import { Hash, Calendar, Building } from "lucide-react";
import { Class, AcademicYear } from "@/lib/api/Class";

interface AcademicDetailsSectionProps {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  academicYears: AcademicYear[];
  filteredClasses: Class[];
  fetchingData: boolean;
  handleAcademicYearChange: (academicYearId: string) => void;
}

export default function AcademicDetailsSection({
  register,
  errors,
  academicYears,
  filteredClasses,
  fetchingData,
  handleAcademicYearChange,
}: AcademicDetailsSectionProps) {
  const academicFields = STUDENT_FIELDS.filter(
    field => field.section === "Academic Details",
  );

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "rollNo":
        return Hash;
      case "admissionDate":
        return Calendar;
      case "academicYearId":
      case "classId":
        return Building;
      default:
        return Hash;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Academic Details</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {academicFields.map(field => {
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
                <DateInput
                  {...register(field.name)}
                  placeholder={field.placeholder}
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
                  <select
                    {...register(field.name)}
                    onChange={e => {
                      register(field.name).onChange(e);
                      if (field.name === "academicYearId") {
                        handleAcademicYearChange(e.target.value);
                      }
                    }}
                    disabled={field.name === "classId" && fetchingData}
                    className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] appearance-none cursor-pointer ${
                      error
                        ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                        : "border-[var(--border)]"
                    } ${field.name === "classId" && fetchingData ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.name === "academicYearId" &&
                      academicYears.map(year => (
                        <option key={year.id} value={year.id}>
                          {year.yearName}
                        </option>
                      ))}
                    {field.name === "classId" &&
                      filteredClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          Class {cls.className} - {cls.section}
                        </option>
                      ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                    {(() => {
                      const Icon = getFieldIcon(field.name);
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-[var(--text-3)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {error && (
                  <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                    {error.message}
                  </p>
                )}
                {field.name === "classId" && fetchingData && (
                  <p className="mt-1 text-xs text-[var(--text-3)]">
                    Loading classes...
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
                  type="text"
                  placeholder={field.placeholder}
                  {...register(field.name)}
                  className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                    error
                      ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                      : "border-[var(--border)]"
                  }`}
                  onInput={
                    field.name === "rollNo"
                      ? e => {
                          const value = e.currentTarget.value;
                          const numericValue = value.replace(/\D/g, "");
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
      </div>
    </div>
  );
}
