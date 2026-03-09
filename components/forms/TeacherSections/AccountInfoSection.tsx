import { Mail, Lock, Eye, EyeOff, RefreshCw } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TeacherFormData } from "@/lib/validations/TeacherSchema";

interface AccountInfoSectionProps {
  register: UseFormRegister<TeacherFormData>;
  errors: FieldErrors<TeacherFormData>;
  mode: "add" | "edit";
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onGeneratePassword: () => void;
}

export default function AccountInfoSection({
  register,
  errors,
  mode,
  showPassword,
  setShowPassword,
  onGeneratePassword,
}: AccountInfoSectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="section-label">Account Info</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="label-base min-h-[24px] flex items-center gap-1">
            Email <span className="text-red-500 text-lg leading-none">*</span>
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("email")}
              type="text"
              placeholder="example@school.com"
              className={`input-base pl-9 ${errors.email ? "error" : ""}`}
            />
          </div>
          {errors.email && (
            <span className="text-xs text-[var(--rose)]">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="label-base min-h-[24px] flex items-center gap-1">
            Password{" "}
            {mode !== "edit" && (
              <span className="text-red-500 text-lg leading-none">*</span>
            )}
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder={mode === "edit" ? "••••••••" : "Min. 8 characters"}
              className={`input-base pl-9 pr-20 ${errors.password ? "error" : ""}`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={onGeneratePassword}
                className="p-1.5 cursor-pointer text-[var(--blue)] hover:bg-[var(--blue-light)] rounded-[var(--radius-sm)] transition-colors"
                title="Generate password"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 cursor-pointer text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <span className="text-xs text-[var(--rose)]">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
