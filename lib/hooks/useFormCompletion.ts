import { UseFormReturn } from "react-hook-form";
import { PersonalDetails, SchoolDetails } from "@/lib/validations/signupSchema";
export function useFormCompletion(
  personalForm: UseFormReturn<PersonalDetails>,
  schoolForm: UseFormReturn<SchoolDetails>,
) {
  const isPersonalStepComplete =
    !!personalForm.watch("firstName")?.trim() &&
    !!personalForm.watch("lastName")?.trim() &&
    !!personalForm.watch("email")?.trim() &&
    !!personalForm.watch("phone")?.trim() &&
    !!personalForm.watch("password")?.trim() &&
    personalForm.watch("password").length >= 8 &&
    !!personalForm.watch("roleId")?.trim();

  const isSchoolStepComplete =
    !!schoolForm.watch("schoolName")?.trim() &&
    !!schoolForm.watch("schoolType") &&
    !!schoolForm.watch("address")?.trim() &&
    !!schoolForm.watch("officialEmail")?.trim() &&
    !!schoolForm.watch("contactNumber")?.trim() &&
    !!schoolForm.watch("mediumOfInstruction") &&
    !!schoolForm.watch("affiliationBoard");

  return { isPersonalStepComplete, isSchoolStepComplete };
}
