import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SchoolDetails } from "@/lib/validations/signupSchema";
import { SchoolDetailsForm } from "@/components/forms/SignUpForm";

interface SchoolStepProps {
  form: UseFormReturn<SchoolDetails>;
}

export function SchoolStep({ form }: SchoolStepProps) {
  return <SchoolDetailsForm form={form} />;
}
