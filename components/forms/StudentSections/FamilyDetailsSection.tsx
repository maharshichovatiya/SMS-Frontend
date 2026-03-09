import { UseFormRegister, FieldErrors } from "react-hook-form";
import { StudentFormValues } from "@/lib/validations/StudentSchema";
import { STUDENT_FIELDS } from "@/lib/validations/StudentSchema";
import { Users, Phone, Heart, IndianRupee } from "lucide-react";

interface FamilyDetailsSectionProps {
  register: UseFormRegister<StudentFormValues>;
  errors: FieldErrors<StudentFormValues>;
}

export default function FamilyDetailsSection({
  register,
  errors,
}: FamilyDetailsSectionProps) {
  const familyFields = STUDENT_FIELDS.filter(
    field => field.section === "Family Details",
  );

  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "fatherName":
      case "motherName":
      case "guardianName":
        return Users;
      case "fatherPhone":
        return Phone;
      case "familyAnnualIncome":
        return IndianRupee;
      case "medicalConditions":
        return Heart;
      default:
        return Users;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Family Details</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyFields.map(field => {
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
                  type={field.type === "tel" ? "tel" : field.type}
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
                          const numericValue = value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          if (value !== numericValue) {
                            e.currentTarget.value = numericValue;
                          }
                        }
                      : field.name === "familyAnnualIncome"
                        ? e => {
                            const value = e.currentTarget.value;
                            const numericValue = value.replace(/\D/g, "");
                            const limitedValue =
                              parseInt(numericValue) > 20000000
                                ? "20000000"
                                : numericValue;
                            if (value !== limitedValue) {
                              e.currentTarget.value = limitedValue;
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
