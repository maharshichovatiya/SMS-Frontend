import {
  Building2,
  Award,
  CalendarCheck,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TeacherFormData } from "@/lib/validations/TeacherSchema";

interface EmploymentInfoSectionProps {
  register: UseFormRegister<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
}

export default function EmploymentInfoSection({
  register,
  errors,
}: EmploymentInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Employment Info</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">
            Department <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Building2
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <select
              {...register("department")}
              className={`input-base pl-9 appearance-none ${
                errors.department ? "error" : ""
              }`}
            >
              <option value="">Select department</option>
              <option value="academic">Academic</option>
              <option value="administration">Administration</option>
              <option value="sports">Sports</option>
              <option value="laboratory">Laboratory</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
          </div>
          {errors.department && (
            <span className="text-xs text-[var(--rose)]">
              {errors.department.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Designation <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Award
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("designation")}
              placeholder="Senior Teacher"
              className={`input-base pl-9 ${errors.designation ? "error" : ""}`}
            />
          </div>
          {errors.designation && (
            <span className="text-xs text-[var(--rose)]">
              {errors.designation.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Date of Joining <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <CalendarCheck
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("dateOfJoining")}
              type="date"
              className={`input-base pl-9 cursor-pointer ${
                errors.dateOfJoining ? "error" : ""
              }`}
            />
          </div>
          {errors.dateOfJoining && (
            <span className="text-xs text-[var(--rose)]">
              {errors.dateOfJoining.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Salary Package (₹ Year){" "}
            <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Wallet
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("salaryPackage")}
              type="number"
              step="any"
              placeholder="60000"
              onKeyDown={e =>
                ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
              }
              className={`input-base pl-9 ${errors.salaryPackage ? "error" : ""}`}
            />
          </div>
          {errors.salaryPackage && (
            <span className="text-xs text-[var(--rose)]">
              {errors.salaryPackage.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
