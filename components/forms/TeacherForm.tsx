import { Resolver, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTeacherSchema,
  TeacherFormData,
} from "@/lib/validations/TeacherSchema";
import { showToast } from "@/lib/utils/Toast";
import { createTeacher, updateTeacher } from "@/lib/api/Teacher";
import { Teacher } from "@/lib/types/Teacher";
import { useEffect, useState } from "react";
import { getRoles } from "@/lib/api/Role";

import {
  Award,
  Building2,
  Calendar,
  CalendarCheck,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { Role } from "@/lib/types/Role";

interface TeacherFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  defaultValues?: Partial<TeacherFormData>;
  mode?: "add" | "edit";
  isLoading?: boolean;
  teacherId?: string;
}

export default function TeacherForm({
  onCancel,
  onSuccess,
  defaultValues,
  mode = "add",
  isLoading = false,
  teacherId,
}: TeacherFormProps) {
  const schema = createTeacherSchema(mode);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(schema) as Resolver<TeacherFormData>,
    defaultValues,
    mode: "onSubmit",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      const res = await getRoles();
      if (res.success && res.data) {
        setRoles(res.data);
      }
    };
    loadRoles();
  }, []);

  const onSubmit: SubmitHandler<TeacherFormData> = async data => {
    try {
      const schoolId = localStorage.getItem("schoolId") || undefined;

      const teacherRoleId = roles.find(
        role => role.roleName.toLowerCase() === "teacher",
      )?.id;

      const totalExpMonths =
        Number(data.experienceYears) * 12 + Number(data.experienceMonths);

      const payload: Teacher = {
        ...data,
        ...(mode === "edit" && { password: undefined }),
        schoolId,
        roleId: teacherRoleId,
        profilePhoto: data.profilePhoto?.[0] || null,
        totalExpMonths,
      };

      let res;

      if (mode === "edit" && teacherId) {
        res = await updateTeacher(teacherId, payload);
      } else {
        res = await createTeacher(payload);
      }

      if (res.success) {
        showToast.success(
          mode === "edit"
            ? "Teacher updated successfully "
            : "Teacher created successfully ",
        );
        reset();
        onSuccess?.();
      } else {
        const message = Array.isArray(res.message)
          ? res.message[0]
          : res.message;
        showToast.error(message || "Something went wrong");
      }
    } catch (error) {
      showToast.error("Something went wrong ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
    >
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
                className={`input-base pl-9 ${errors.password ? "error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-[var(--rose)]">
                {errors.password.message}
              </span>
            )}
          </div>
        </div>
      </div>

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
                className={`input-base pl-9 ${
                  errors.designation ? "error" : ""
                }`}
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
                className={`input-base pl-9 ${
                  errors.highestQualification ? "error" : ""
                }`}
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
                <input
                  {...register("experienceMonths")}
                  type="number"
                  min={0}
                  max={11}
                  placeholder="Months"
                  onKeyDown={e =>
                    ["e", "E", "+", "-", "."].includes(e.key) &&
                    e.preventDefault()
                  }
                  className={`input-base ${errors.experienceMonths ? "error" : ""}`}
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

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-7 cursor-pointer py-3 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text-2)] font-medium hover:bg-[var(--bg-2)] transition"
        >
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="btn-primary">
          {isLoading
            ? "Saving..."
            : mode === "edit"
              ? "Update Teacher"
              : "Save Teacher"}
        </button>
      </div>
    </form>
  );
}
