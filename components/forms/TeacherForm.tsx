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
import { generatePassword } from "@/lib/utils/PasswordGenerator";
import { Role } from "@/lib/types/Role";

// Import section components
import AccountInfoSection from "./TeacherSections/AccountInfoSection";
import PersonalInfoSection from "./TeacherSections/PersonalInfoSection";
import EmploymentInfoSection from "./TeacherSections/EmploymentInfoSection";
import QualificationsSection from "./TeacherSections/QualificationsSection";
import AdditionalInfoSection from "./TeacherSections/AdditionalInfoSection";
import AddressInfoSection from "./TeacherSections/AddressInfoSection";

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

  const handleGeneratePassword = () => {
    const { password } = generatePassword({
      length: 12,
      uppercase: true,
      lowercase: true,
      numbers: true,
      special: true,
    });
    setValue("password", password);
    setShowPassword(true);
    showToast.success("Password generated successfully!");
  };

  const hasChanges = () => {
    if (!defaultValues || mode !== "edit") return true;

    const currentValues = watch();
    return Object.keys(defaultValues).some(key => {
      const defaultValue = defaultValues[key as keyof TeacherFormData];
      const currentValue = currentValues[key as keyof TeacherFormData];

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
      const currentAddressValue = watch("currentAddress") || "";
      setValue("permanentAddress", currentAddressValue);
    }
  }, [sameAsPermanent, watch, setValue]);

  const onSubmit: SubmitHandler<TeacherFormData> = async data => {
    try {
      const schoolId = localStorage.getItem("schoolId") || undefined;

      const teacherRoleId = roles.find(
        role => role.roleName.toLowerCase() === "teacher",
      )?.id;

      // Handle experience - pass null if no experience is provided, otherwise calculate total months
      const totalExpMonths =
        !data.experienceYears && !data.experienceMonths
          ? null
          : Number(data.experienceYears || 0) * 12 +
            Number(data.experienceMonths || 0);

      // Convert empty strings to null for optional fields and exclude individual experience fields
      const {
        experienceYears: _experienceYears,
        experienceMonths: _experienceMonths,
        ...dataWithoutExperience
      } = data;

      const processedData = {
        ...dataWithoutExperience,
        bloodGroup: dataWithoutExperience.bloodGroup?.trim() || null,
        aadhaarNo: dataWithoutExperience.aadhaarNo?.trim() || null,
        panNo: dataWithoutExperience.panNo?.trim() || null,
        permanentAddress:
          dataWithoutExperience.permanentAddress?.trim() || null,
        currentAddress: dataWithoutExperience.currentAddress?.trim() || null,
        bankName: dataWithoutExperience.bankName?.trim() || null,
        accountNo: dataWithoutExperience.accountNo?.trim() || null,
        ifscCode: dataWithoutExperience.ifscCode?.trim() || null,
        branch: dataWithoutExperience.branch?.trim() || null,
        ...(mode === "edit" && { password: undefined }),
        schoolId,
        roleId: teacherRoleId,
        profilePhoto:
          (dataWithoutExperience.profilePhoto as FileList)?.[0] || null,
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
    } catch (_error) {
      showToast.error("Something went wrong ");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto"
    >
      <AccountInfoSection
        register={register}
        errors={errors}
        mode={mode}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        onGeneratePassword={handleGeneratePassword}
      />

      <PersonalInfoSection register={register} errors={errors} />

      <EmploymentInfoSection register={register} errors={errors} />

      <QualificationsSection register={register} errors={errors} />

      <AdditionalInfoSection register={register} errors={errors} />

      <AddressInfoSection
        register={register}
        errors={errors}
        sameAsPermanent={sameAsPermanent}
        setSameAsPermanent={setSameAsPermanent}
      />

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
