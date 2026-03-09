import { User, Users, Phone, Calendar, ChevronDown } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TeacherFormData } from "@/lib/validations/TeacherSchema";

interface PersonalInfoSectionProps {
  register: UseFormRegister<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
}

export default function PersonalInfoSection({
  register,
  errors,
}: PersonalInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Personal Info</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base">
            First Name <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("firstName")}
              placeholder="First Name"
              className={`input-base pl-9 ${errors.firstName ? "error" : ""}`}
            />
          </div>
          {errors.firstName && (
            <span className="text-xs text-[var(--rose)]">
              {errors.firstName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 mt-3">
          <label className="label-base">Middle Name</label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("middleName")}
              placeholder="Middle Name (Optional)"
              className={`input-base pl-9 ${errors.middleName ? "error" : ""}`}
            />
          </div>
          {errors.middleName && (
            <span className="text-xs text-[var(--rose)]">
              {errors.middleName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Last Name <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("lastName")}
              placeholder="Last Name"
              className={`input-base pl-9 ${errors.lastName ? "error" : ""}`}
            />
          </div>
          {errors.lastName && (
            <span className="text-xs text-[var(--rose)]">
              {errors.lastName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Phone <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("phone")}
              type="tel"
              placeholder="9876543210"
              maxLength={10}
              onKeyDown={e => {
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className={`input-base pl-9 ${errors.phone ? "error" : ""}`}
            />
          </div>
          {errors.phone && (
            <span className="text-xs text-[var(--rose)]">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Gender <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Users
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <select
              {...register("gender")}
              className={`input-base pl-9 appearance-none ${
                errors.gender ? "error" : ""
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
          </div>
          {errors.gender && (
            <span className="text-xs text-[var(--rose)]">
              {errors.gender.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base">
            Date of Birth <span className="text-red-500 text-lg">*</span>
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("dob")}
              max={new Date().toISOString().split("T")[0]}
              type="date"
              className={`input-base pl-9 cursor-pointer ${errors.dob ? "error" : ""}`}
            />
          </div>
          {errors.dob && (
            <span className="text-xs text-[var(--rose)]">
              {errors.dob.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
