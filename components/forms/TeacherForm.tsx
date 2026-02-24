import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherFormData, teacherSchema } from "@/lib/validations/teacherForm";

interface TeacherFormProps {
  onCancel: () => void;
  defaultValues?: Partial<TeacherFormData>;
  mode?: "add" | "edit";
  isLoading?: boolean;
}

export default function TeacherForm({
  onCancel,
  defaultValues,
  mode = "add",
  isLoading = false,
}: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<TeacherFormData> = _data => {
    // Submit logic here
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
            <label className="label-base">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@school.com"
              className={`input-base pl-4 ${errors.email ? "error" : ""}`}
            />
            {errors.email && (
              <span className="text-xs text-[var(--rose)]">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">
              Password
              {mode === "edit" && (
                <span className="ml-2 text-[var(--text-3)] normal-case font-normal tracking-normal">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder={mode === "edit" ? "••••••••" : "Min. 8 characters"}
              className={`input-base pl-4 ${errors.password ? "error" : ""}`}
            />
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
            <label className="label-base">First Name</label>
            <input
              {...register("firstName")}
              placeholder="John"
              className={`input-base pl-4 ${errors.firstName ? "error" : ""}`}
            />
            {errors.firstName && (
              <span className="text-xs text-[var(--rose)]">
                {errors.firstName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Last Name</label>
            <input
              {...register("lastName")}
              placeholder="Doe"
              className={`input-base pl-4 ${errors.lastName ? "error" : ""}`}
            />
            {errors.lastName && (
              <span className="text-xs text-[var(--rose)]">
                {errors.lastName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Phone</label>
            <input
              {...register("phone")}
              placeholder="+91 98765 43210"
              className={`input-base pl-4 ${errors.phone ? "error" : ""}`}
            />
            {errors.phone && (
              <span className="text-xs text-[var(--rose)]">
                {errors.phone.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Gender</label>
            <select
              {...register("gender")}
              className={`input-base pl-4 appearance-none ${errors.gender ? "error" : ""}`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <span className="text-xs text-[var(--rose)]">
                {errors.gender.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Date of Birth</label>
            <input
              {...register("dob")}
              type="date"
              className={`input-base pl-4 ${errors.dob ? "error" : ""}`}
            />
            {errors.dob && (
              <span className="text-xs text-[var(--rose)]">
                {errors.dob.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Profile Photo</label>
            <input
              {...register("profilePhoto")}
              type="file"
              accept="image/*"
              className="input-base pl-4 pt-3"
            />
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
            <label className="label-base">School ID</label>
            <input
              {...register("schoolId")}
              placeholder="SCH-001"
              className={`input-base pl-4 ${errors.schoolId ? "error" : ""}`}
            />
            {errors.schoolId && (
              <span className="text-xs text-[var(--rose)]">
                {errors.schoolId.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Employee Code</label>
            <input
              {...register("employeeCode")}
              placeholder="EMP-2024-001"
              className={`input-base pl-4 ${errors.employeeCode ? "error" : ""}`}
            />
            {errors.employeeCode && (
              <span className="text-xs text-[var(--rose)]">
                {errors.employeeCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Staff Category</label>
            <select
              {...register("staffCategory")}
              className={`input-base  pl-4 appearance-none ${errors.staffCategory ? "error" : ""}`}
            >
              <option value="">Select category</option>
              <option value="teaching">Teaching</option>
              <option value="non-teaching">Non-Teaching</option>
              <option value="administrative">Administrative</option>
              <option value="support">Support</option>
            </select>
            {errors.staffCategory && (
              <span className="text-xs text-[var(--rose)]">
                {errors.staffCategory.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Department</label>
            <input
              {...register("department")}
              placeholder="Mathematics"
              className={`input-base pl-4 ${errors.department ? "error" : ""}`}
            />
            {errors.department && (
              <span className="text-xs text-[var(--rose)]">
                {errors.department.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Designation</label>
            <input
              {...register("designation")}
              placeholder="Senior Teacher"
              className={`input-base pl-4 ${errors.designation ? "error" : ""}`}
            />
            {errors.designation && (
              <span className="text-xs text-[var(--rose)]">
                {errors.designation.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Date of Joining</label>
            <input
              {...register("dateOfJoining")}
              type="date"
              className={`input-base pl-4 ${errors.dateOfJoining ? "error" : ""}`}
            />
            {errors.dateOfJoining && (
              <span className="text-xs text-[var(--rose)]">
                {errors.dateOfJoining.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Salary Package (₹/month)</label>
            <input
              {...register("salaryPackage")}
              type="number"
              placeholder="50000"
              className={`input-base pl-4 ${errors.salaryPackage ? "error" : ""}`}
            />
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
            <label className="label-base">Highest Qualification</label>
            <input
              {...register("highestQualification")}
              placeholder="B.Ed / M.Sc / Ph.D"
              className={`input-base pl-4 ${errors.highestQualification ? "error" : ""}`}
            />
            {errors.highestQualification && (
              <span className="text-xs text-[var(--rose)]">
                {errors.highestQualification.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Experience (Years)</label>
            <input
              {...register("experienceYears")}
              type="number"
              placeholder="5"
              className={`input-base pl-4 ${errors.experienceYears ? "error" : ""}`}
            />
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
          className="px-6 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] font-medium hover:bg-[var(--bg-2)] transition"
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
