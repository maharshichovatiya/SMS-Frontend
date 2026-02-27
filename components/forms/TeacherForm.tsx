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
  BadgeCheck,
  Briefcase,
  Building2,
  Calendar,
  CalendarCheck,
  ChevronDown,
  Clock,
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
    mode: "onChange",
  });

  const [roles, setRoles] = useState<Role[]>([]);

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

      const payload: Teacher = {
        ...data,
        ...(mode === "edit" && { password: undefined }),
        schoolId,
        roleId: teacherRoleId,
        profilePhoto: data.profilePhoto?.[0] || null,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                type="email"
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
                type="password"
                placeholder={mode === "edit" ? "••••••••" : "Min. 8 characters"}
                className={`input-base pl-9 ${errors.password ? "error" : ""}`}
              />
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
                placeholder="98765 43210"
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
                className={`input-base pl-9 ${errors.dob ? "error" : ""}`}
              />
            </div>
            {errors.dob && (
              <span className="text-xs text-[var(--rose)]">
                {errors.dob.message}
              </span>
            )}
          </div>

          {/* <div className="flex mt-3 flex-col gap-1">
            <label className="label-base">Profile Photo</label>
            <div className="relative">
              <Camera
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("profilePhoto")}
                type="file"
                accept="image/*"
                className="input-base pl-9 pt-3"
              />
            </div>
          </div> */}
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
              Employee Code <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <BadgeCheck
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("employeeCode")}
                placeholder="EMP-2024-001"
                className={`input-base pl-9 ${
                  errors.employeeCode ? "error" : ""
                }`}
              />
            </div>
            {errors.employeeCode && (
              <span className="text-xs text-[var(--rose)]">
                {errors.employeeCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">
              Staff Category <span className="text-red-500 text-lg">*</span>
            </label>
            <div className="relative">
              <Briefcase
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <select
                {...register("staffCategory")}
                className={`input-base pl-9 pr-9 appearance-none ${
                  errors.staffCategory ? "error" : ""
                }`}
              >
                <option value="">Select category</option>
                <option value="teaching">Teaching</option>
                <option value="non_teaching">Non-Teaching</option>
                <option value="admin">Administrative</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
            </div>
            {errors.staffCategory && (
              <span className="text-xs text-[var(--rose)]">
                {errors.staffCategory.message}
              </span>
            )}
          </div>

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
                className={`input-base pl-9 ${
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
              Salary Package (₹/month){" "}
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
                placeholder="50000"
                className={`input-base pl-9 ${
                  errors.salaryPackage ? "error" : ""
                }`}
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
            <label className="label-base">Experience (Years)</label>
            <div className="relative">
              <Clock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("experienceYears")}
                type="number"
                placeholder="5"
                className={`input-base pl-9 ${
                  errors.experienceYears ? "error" : ""
                }`}
              />
            </div>
            {errors.experienceYears && (
              <span className="text-xs text-[var(--rose)]">
                {errors.experienceYears.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 cursor-pointer py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] font-medium hover:bg-[var(--bg-2)] transition"
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
