import { GraduationCap, Clock, ChevronDown } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TeacherFormData } from "@/lib/validations/TeacherSchema";

interface QualificationsSectionProps {
  register: UseFormRegister<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
  disabled?: boolean;
}

export default function QualificationsSection({
  register,
  errors,
  disabled = false,
}: QualificationsSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Qualifications</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">
            Highest Qualification{" "}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <GraduationCap
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("highestQualification")}
              placeholder="B.Ed / M.Sc / Ph.D"
              disabled={disabled}
              className={`input-base pl-9 ${
                errors.highestQualification ? "error" : ""
              } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />
          </div>
          {errors.highestQualification && (
            <span className="text-xs text-[var(--rose)]">
              {errors.highestQualification.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <label className="label-base">Experience</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("experienceYears")}
                type="number"
                min={0}
                placeholder="Years"
                onKeyDown={e =>
                  ["e", "E", "+", "-", "."].includes(e.key) &&
                  e.preventDefault()
                }
                className={`input-base pl-9 ${errors.experienceYears ? "error" : ""}`}
              />
            </div>

            <div className="relative flex-1">
              <select
                {...register("experienceMonths", { valueAsNumber: true })}
                className={`input-base appearance-none ${errors.experienceMonths ? "error" : ""}`}
                defaultValue="0"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i}>
                    {i} {i === 1 ? "month" : "months"}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
            </div>
          </div>
          {errors.experienceYears && (
            <span className="text-xs text-[var(--rose)]">
              {errors.experienceYears.message}
            </span>
          )}
          {errors.experienceMonths && (
            <span className="text-xs text-[var(--rose)]">
              {errors.experienceMonths.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
