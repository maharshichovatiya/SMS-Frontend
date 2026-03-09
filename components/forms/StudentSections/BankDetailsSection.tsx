import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StudentFormValues } from "@/lib/validations/StudentSchema";
import { STUDENT_FIELDS } from "@/lib/validations/StudentSchema";
import { Building, CreditCard, Hash } from "lucide-react";

interface BankDetailsSectionProps {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
}

export default function BankDetailsSection({
  register,
  errors,
}: BankDetailsSectionProps) {
  const bankFields = STUDENT_FIELDS.filter(
    field => field.section === "Bank Details",
  );

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "bankName":
        return Building;
      case "accountNo":
        return CreditCard;
      case "ifscCode":
      case "branch":
        return Hash;
      default:
        return Building;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Bank Details</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankFields.map(field => {
          const error = errors[field.name];
          const isFullWidth = field.fullWidth;

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
                  maxLength={
                    field.name === "accountNo"
                      ? 18
                      : field.name === "ifscCode"
                        ? 11
                        : undefined
                  }
                  {...register(field.name)}
                  className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                    error
                      ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                      : "border-[var(--border)]"
                  }`}
                  onInput={
                    field.name === "accountNo"
                      ? e => {
                          const value = e.currentTarget.value;
                          const numericValue = value
                            .replace(/\D/g, "")
                            .slice(0, 18);
                          if (value !== numericValue) {
                            e.currentTarget.value = numericValue;
                          }
                        }
                      : field.name === "ifscCode"
                        ? e => {
                            const value = e.currentTarget.value;
                            const upperCaseValue = value
                              .toUpperCase()
                              .replace(/[^A-Z0-9]/g, "")
                              .slice(0, 11);
                            if (value !== upperCaseValue) {
                              e.currentTarget.value = upperCaseValue;
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
