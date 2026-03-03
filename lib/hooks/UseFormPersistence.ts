import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PersonalDetails, SchoolDetails } from "@/lib/validations/SignUpSchema";

interface UseFormPersistenceProps {
  personalForm: UseFormReturn<PersonalDetails>;
  schoolForm: UseFormReturn<SchoolDetails>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export const useFormPersistence = ({
  personalForm,
  schoolForm,
  currentStep,
  setCurrentStep,
}: UseFormPersistenceProps) => {
  // Persistence keys
  const PERSONAL_DATA_KEY = "signup_personal_details";
  const SCHOOL_DATA_KEY = "signup_school_details";
  const STEP_KEY = "signup_current_step";

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedPersonalData = localStorage.getItem(PERSONAL_DATA_KEY);
    const savedSchoolData = localStorage.getItem(SCHOOL_DATA_KEY);
    const savedStep = localStorage.getItem(STEP_KEY);
    const adminRoleId = localStorage.getItem("adminRoleId");

    if (savedPersonalData) {
      try {
        const parsedPersonalData = JSON.parse(savedPersonalData);
        Object.keys(parsedPersonalData).forEach(key => {
          personalForm.setValue(
            key as keyof PersonalDetails,
            parsedPersonalData[key],
            { shouldValidate: false }, // Don't validate on initial load
          );
        });
      } catch (e) {}
    }

    if (savedSchoolData) {
      try {
        const parsedSchoolData = JSON.parse(savedSchoolData);
        Object.keys(parsedSchoolData).forEach(key => {
          schoolForm.setValue(
            key as keyof SchoolDetails,
            parsedSchoolData[key],
            { shouldValidate: false }, // Don't validate on initial load
          );
        });
      } catch (e) {}
    }

    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }

    if (adminRoleId) {
      personalForm.setValue("roleId", adminRoleId, { shouldValidate: false });
    }
  }, [personalForm, schoolForm, setCurrentStep]);

  // Watch individual form changes to persist them
  const personalValues = personalForm.watch();
  const schoolValues = schoolForm.watch();

  // Save personal form data to localStorage on change (debounced)
  useEffect(() => {
    if (Object.keys(personalValues).length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem(PERSONAL_DATA_KEY, JSON.stringify(personalValues));
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [personalValues]);

  // Save school form data to localStorage on change (debounced)
  useEffect(() => {
    if (Object.keys(schoolValues).length > 0) {
      const timer = setTimeout(() => {
        localStorage.setItem(SCHOOL_DATA_KEY, JSON.stringify(schoolValues));
      }, 500); // 500ms debounce
      return () => clearTimeout(timer);
    }
  }, [schoolValues]);

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem(STEP_KEY, currentStep.toString());
  }, [currentStep]);

  const clearPersistence = () => {
    localStorage.removeItem(PERSONAL_DATA_KEY);
    localStorage.removeItem(SCHOOL_DATA_KEY);
    localStorage.removeItem(STEP_KEY);
  };

  return { clearPersistence };
};
