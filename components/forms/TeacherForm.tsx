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
  Home,
  MapPin,
  Banknote,
  CreditCard,
  Building,
  FileText,
  Droplet,
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(schema) as Resolver<TeacherFormData>,
    defaultValues,
    mode: "onSubmit",
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  const formValues = watch();

  const hasChanges = () => {
    if (!defaultValues || mode !== "edit") return true;

    return Object.keys(defaultValues).some(key => {
      const defaultValue = defaultValues[key as keyof TeacherFormData];
      const currentValue = formValues[key as keyof TeacherFormData];

      if (key === "profilePhoto") {
        return false;
      }

      return String(defaultValue ?? "") !== String(currentValue ?? "");
    });
  };

  useEffect(() => {
    const loadRoles = async () => {
      const res = await getRoles();
      if (res.success && res.data) {
        setRoles(res.data);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    if (sameAsPermanent) {
      const currentAddressValue = formValues.currentAddress || "";
      setValue("permanentAddress", currentAddressValue);
    }
  }, [sameAsPermanent, formValues.currentAddress]);

  const onSubmit: SubmitHandler<TeacherFormData> = async data => {
    try {
      const schoolId = localStorage.getItem("schoolId") || undefined;

      const teacherRoleId = roles.find(
        role => role.roleName.toLowerCase() === "teacher",
      )?.id;

      const totalExpMonths =
        Number(data.experienceYears) * 12 + Number(data.experienceMonths);

      // Convert empty strings to null for optional fields
      const processedData = {
        ...data,
        bloodGroup: data.bloodGroup?.trim() || null,
        aadhaarNo: data.aadhaarNo?.trim() || null,
        panNo: data.panNo?.trim() || null,
        permanentAddress: data.permanentAddress?.trim() || null,
        currentAddress: data.currentAddress?.trim() || null,
        bankName: data.bankName?.trim() || null,
        accountNo: data.accountNo?.trim() || null,
        ifscCode: data.ifscCode?.trim() || null,
        branch: data.branch?.trim() || null,
        ...(mode === "edit" && { password: undefined }),
        schoolId,
        roleId: teacherRoleId,
        profilePhoto: data.profilePhoto?.[0] || null,
        totalExpMonths,
      };

      const payload: Teacher = processedData;

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
        let message = res.message;
        if (
          res.message &&
          res.message.length > 0 &&
          typeof res.message === "object"
        ) {
          message = res.message[0];
        }
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

      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="section-label">Additional Information</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-base">Blood Group</label>
            <div className="relative">
              <Droplet
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <select
                {...register("bloodGroup")}
                className={`input-base pl-9 appearance-none ${
                  errors.bloodGroup ? "error" : ""
                }`}
              >
                <option value="">Select blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
            </div>
            {errors.bloodGroup && (
              <span className="text-xs text-[var(--rose)]">
                {errors.bloodGroup.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Aadhaar Number</label>
            <div className="relative">
              <FileText
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("aadhaarNo")}
                type="text"
                placeholder="123456789012"
                maxLength={12}
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
                className={`input-base pl-9 ${errors.aadhaarNo ? "error" : ""}`}
              />
            </div>
            {errors.aadhaarNo && (
              <span className="text-xs text-[var(--rose)]">
                {errors.aadhaarNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">PAN Number</label>
            <div className="relative">
              <CreditCard
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("panNo")}
                type="text"
                placeholder="ABCDE1234F"
                maxLength={10}
                className={`input-base pl-9 uppercase ${errors.panNo ? "error" : ""}`}
                onInput={e => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.toUpperCase();
                }}
              />
            </div>
            {errors.panNo && (
              <span className="text-xs text-[var(--rose)]">
                {errors.panNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Bank Name</label>
            <div className="relative">
              <Building
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("bankName")}
                type="text"
                placeholder="State Bank of India"
                onKeyDown={e => {
                  if (
                    !/[a-zA-Z\s&.-]/.test(e.key) &&
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
                className={`input-base pl-9 ${errors.bankName ? "error" : ""}`}
              />
            </div>
            {errors.bankName && (
              <span className="text-xs text-[var(--rose)]">
                {errors.bankName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Account Number</label>
            <div className="relative">
              <Banknote
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("accountNo")}
                type="text"
                placeholder="123456789012345"
                maxLength={18}
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
                className={`input-base pl-9 ${errors.accountNo ? "error" : ""}`}
              />
            </div>
            {errors.accountNo && (
              <span className="text-xs text-[var(--rose)]">
                {errors.accountNo.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">IFSC Code</label>
            <div className="relative">
              <CreditCard
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("ifscCode")}
                type="text"
                placeholder="SBIN0001234"
                maxLength={11}
                className={`input-base pl-9 ${errors.ifscCode ? "error" : ""}`}
              />
            </div>
            {errors.ifscCode && (
              <span className="text-xs text-[var(--rose)]">
                {errors.ifscCode.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Bank Branch</label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <input
                {...register("branch")}
                type="text"
                placeholder="Main Branch"
                onKeyDown={e => {
                  if (
                    !/[a-zA-Z\s&.-]/.test(e.key) &&
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
                className={`input-base pl-9 ${errors.branch ? "error" : ""}`}
              />
            </div>
            {errors.branch && (
              <span className="text-xs text-[var(--rose)]">
                {errors.branch.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="section-label">Address Information</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1">
            <label className="label-base">Current Address</label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-3 pt-2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <textarea
                {...register("currentAddress")}
                placeholder="Enter your current address..."
                rows={5}
                className={`input-base pl-9 pt-2 resize-none ${errors.currentAddress ? "error" : ""}`}
              />
            </div>
            {errors.currentAddress && (
              <span className="text-xs text-[var(--rose)]">
                {errors.currentAddress.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 my-2">
            <input
              type="checkbox"
              id="sameAsPermanent"
              checked={sameAsPermanent}
              onChange={e => setSameAsPermanent(e.target.checked)}
              className="w-4 h-4 text-[var(--blue)] bg-[var(--bg-2)] border-[var(--border)] rounded focus:ring-[var(--blue-light)] focus:ring-2"
            />
            <label
              htmlFor="sameAsPermanent"
              className="text-sm text-[var(--text-2)] cursor-pointer select-none"
            >
              Permanent address same as current address
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="label-base">Permanent Address</label>
            <div className="relative">
              <Home
                className="absolute left-3 top-3 pt-2 w-4 h-4 pointer-events-none"
                style={{ color: "var(--text-3)" }}
              />
              <textarea
                {...register("permanentAddress")}
                placeholder="Enter your permanent address..."
                rows={5}
                disabled={sameAsPermanent}
                className={`input-base pl-9 pt-2 resize-none ${errors.permanentAddress ? "error" : ""} ${sameAsPermanent ? "opacity-60 cursor-not-allowed" : ""}`}
              />
            </div>
            {errors.permanentAddress && (
              <span className="text-xs text-[var(--rose)]">
                {errors.permanentAddress.message}
              </span>
            )}
            {sameAsPermanent && (
              <span className="text-xs text-[var(--text-3)] italic">
                Auto-filled from current address
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
        <button
          type="submit"
          disabled={isLoading || (mode === "edit" && !hasChanges())}
          className="btn-primary"
        >
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
