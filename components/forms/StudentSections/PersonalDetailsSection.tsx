import { UseFormRegister, UseFormWatch, FieldErrors } from "react-hook-form";
import { StudentFormValues } from "@/lib/validations/StudentSchema";
import { STUDENT_FIELDS } from "@/lib/validations/StudentSchema";
import DateInput from "@/components/ui/DateInput";
import {
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Heart,
  Hash,
  CreditCard,
} from "lucide-react";

interface PersonalDetailsSectionProps {
  register: UseFormRegister<StudentFormValues>;
  watch: UseFormWatch<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  handleGeneratePassword: () => void;
  isEditMode: boolean;
}

export default function PersonalDetailsSection({
  register,
  watch,
  errors,
  showPassword,
  setShowPassword,
  handleGeneratePassword,
  isEditMode,
}: PersonalDetailsSectionProps) {
  const personalFields = STUDENT_FIELDS.filter(
    field => field.section === "Personal Details",
  );

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "firstName":
      case "middleName":
      case "lastName":
        return User;
      case "email":
        return Mail;
      case "password":
        return Lock;
      case "phone":
        return Phone;
      case "dob":
        return Calendar;
      case "bloodGroup":
        return Heart;
      case "aadhaarNo":
        return Hash;
      case "panNo":
        return CreditCard;
      default:
        return User;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Personal Details</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {personalFields.map(field => {
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

          if (field.type === "select") {
            let options: { value: string; label: string }[] = [];

            if (field.name === "gender") {
              options = [
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ];
            } else if (field.name === "bloodGroup") {
              options = [
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ];
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
                  <select
                    {...register(field.name)}
                    className={`w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] appearance-none cursor-pointer ${
                      error
                        ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <option value="">{field.placeholder}</option>
                    {options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                  {!field.optional && (
                    <span className="text-[var(--rose)] ml-0.5">*</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditMode ? "••••••••" : field.placeholder}
                    {...register(field.name)}
                    className={`w-full px-3.5 py-2.5 pl-10 pr-20 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                      error
                        ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                        : "border-[var(--border)]"
                    }`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="p-1.5 cursor-pointer text-[var(--blue)] hover:bg-[var(--blue-light)] rounded-[var(--radius-sm)] transition-colors"
                      title="Generate password"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 cursor-pointer text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
                      : field.name === "aadhaarNo" || field.name === "panNo"
                        ? "text"
                        : field.type
                  }
                  placeholder={field.placeholder}
                  maxLength={
                    field.name === "aadhaarNo"
                      ? 12
                      : field.name === "panNo"
                        ? 10
                        : undefined
                  }
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
                            const numericValue = value
                              .replace(/\D/g, "")
                              .slice(0, 12);
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
