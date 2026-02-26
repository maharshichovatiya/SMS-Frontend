import React from "react";
import { UseFormReturn } from "react-hook-form";
import { PersonalDetails } from "@/lib/validations/signupSchema";
import { PersonalDetailsForm } from "@/components/forms/SignUpForm";

interface PersonalStepProps {
  form: UseFormReturn<PersonalDetails>;
  showPass: boolean;
  setShowPass: (val: boolean) => void;
  pwStrength: number;
  pwColors: string[];
  pwLabels: string[];
  roles: Array<{ id: string; roleName: string; status: string }>;
  rolesLoading: boolean;
}

export function PersonalStep({
  form,
  showPass,
  setShowPass,
  pwStrength,
  pwColors,
  pwLabels,
  roles,
  rolesLoading,
}: PersonalStepProps) {
  return (
    <PersonalDetailsForm
      form={form}
      showPass={showPass}
      setShowPass={setShowPass}
      pwStrength={pwStrength}
      pwColors={pwColors}
      pwLabels={pwLabels}
      roles={roles}
      rolesLoading={rolesLoading}
    />
  );
}
