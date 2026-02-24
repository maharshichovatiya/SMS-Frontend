"use client";
import React, { useState, useEffect } from "react";
import { GraduationCap, Users, BarChart3 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalDetailsSchema,
  schoolDetailsSchema,
  PersonalDetails,
  SchoolDetails,
} from "@/lib/validations/signupSchema";
import { StepProgress } from "@/components/forms/StepProgress";
import { FormNavigation } from "@/components/forms/FormNavigation";
import { useFormCompletion } from "@/lib/hooks/useFormCompletion";
import { PersonalStep } from "@/components/forms/PersonalStep";
import { SchoolStep } from "@/components/forms/SchoolStep";
import { PW_COLORS, PW_LABELS } from "@/lib/utils/signupConstants";
import { createSchool, signup, getRoles, Role } from "@/lib/api/auth";
import { showToast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation";
export default function SignUpPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const personalForm = useForm<PersonalDetails>({
    resolver: zodResolver(personalDetailsSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      roleId: "",
    },
  });

  const schoolForm = useForm<SchoolDetails>({
    resolver: zodResolver(schoolDetailsSchema),
    mode: "onChange",
    defaultValues: {
      schoolName: "",
      schoolType: undefined,
      address: "",
      officialEmail: "",
      contactNumber: "",
      mediumOfInstruction: undefined,
      affiliationBoard: undefined,
      schoolCode: "",
      establishmentYear: "",
      adminEmail: "",
      websiteUrl: "",
    },
  });

  const password = personalForm.watch("password") ?? "";
  const pwStrength =
    password.length === 0
      ? 0
      : password.length < 8
        ? 1
        : /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^a-zA-Z0-9]/.test(password)
          ? 3
          : 2;
  const pwColors = PW_COLORS;
  const pwLabels = PW_LABELS;

  const { isPersonalStepComplete, isSchoolStepComplete } = useFormCompletion(
    personalForm,
    schoolForm,
  );
  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const response = await getRoles();
        setRoles(response.data.data);
        showToast.apiSuccess("Roles are added");
      } catch (error) {
        showToast.apiError(error);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const nextStep = async () => {
    const isValid = await personalForm.trigger();
    if (isValid && isPersonalStepComplete) setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);

  const handleSubmit = async () => {
    const isValid = await schoolForm.trigger();
    if (!isValid) return;
    setLoading(true);
    try {
      const schoolData = { ...schoolForm.getValues() };
      const personalDetails = { ...personalForm.getValues() };
      if (personalDetails.phone) {
        personalDetails.phone = personalDetails.phone.replace(/[^\d]/g, "");
      }
      if (schoolData.contactNumber) {
        schoolData.contactNumber = schoolData.contactNumber.replace(
          /[^\d]/g,
          "",
        );
      }
      const mappedSchoolData = {
        name: schoolData.schoolName,
        type: schoolData.schoolType,
        address: schoolData.address,
        emailOfficial: schoolData.officialEmail,
        contact: schoolData.contactNumber,
        mediumOfInstruction: schoolData.mediumOfInstruction,
        affiliationBoard: schoolData.affiliationBoard,
        schoolCode: schoolData.schoolCode || undefined,
        establishmentYear: schoolData.establishmentYear
          ? parseInt(schoolData.establishmentYear)
          : undefined,
        emailAdmin: schoolData.adminEmail || undefined,
        websiteUrl: schoolData.websiteUrl || undefined,
      };

      console.log("Mapped school data:", mappedSchoolData);
      showToast.loading("Creating your school...");
      const SchoolResponse = await createSchool(mappedSchoolData);
      showToast.loading("Creating your account...");
      const response = await signup({
        ...personalDetails,
        schoolId: SchoolResponse.data.data.id,
      });
      showToast.apiSuccess("Account created successfully!");
      router.replace("/dashboard");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      showToast.apiError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-8 overflow-hidden">
      <div className="w-full mx-2 sm:mx-5 md:mx-7 lg:mx-12 max-w-7xl max-h-[calc(100vh-4rem)] flex rounded-[28px] overflow-hidden shadow-[0_0_0_1px_rgba(61,108,244,0.08),0_32px_80px_rgba(61,108,244,0.13)] bg-white flex-col lg:flex-row">
        <div className="hidden lg:flex flex-col justify-start gap-10 w-[46%] bg-gradient-to-br from-[var(--blue)] to-[var(--indigo)] p-12 relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20"
              style={{ boxShadow: "var(--shadow-blue)" }}
            >
              <GraduationCap
                className="w-5 h-5"
                style={{ color: "var(--text-inverse)" }}
              />
            </div>
            <div>
              <p className="text-[var(--text-inverse)] font-bold text-[15px]">
                School Management System
              </p>
              <p className="text-[var(--text-inverse)]/50 text-[10px] uppercase tracking-widest font-medium">
                Admin Registration
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-[var(--text-inverse)] text-[36px] font-extrabold leading-[1.1] tracking-tight">
              Create your Admin Account
              <br />
              <span className="text-(--text-inverse)/50 font-normal">
                and setup your school.
              </span>
            </h2>
            <p className="text-[var(--text-inverse)] mt-1.5 leading-relaxed max-w-82.5">
              Start managing students, staff, attendance, exams, and
              communication — all from one powerful platform.
            </p>
            <div className="space-y-3 text-[var(--text-inverse)] text-[15px]">
              <div className="flex items-center gap-3">
                <span>Register your school in minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <Users
                    className="w-4 h-4"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </span>
                <span>Add staff and assign roles easily</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/15">
                  <BarChart3
                    className="w-4 h-4"
                    style={{ color: "var(--text-inverse)" }}
                  />
                </span>
                <span>Get real-time reports instantly</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="w-full lg:w-[54%] overflow-hidden flex flex-col">
          <div className="p-6 lg:p-10 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--blue)] mb-3">
                  <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)]" />
                  Create Account
                </span>
                <h1 className="text-3xl font-extrabold text-[var(--text)] tracking-tight leading-tight">
                  {currentStep === 1
                    ? "Set up your admin profile"
                    : "Set up your school details"}
                </h1>
              </div>
              <StepProgress currentStep={currentStep} />
            </div>

            <form
              onSubmit={
                currentStep === 1
                  ? personalForm.handleSubmit(nextStep)
                  : schoolForm.handleSubmit(handleSubmit)
              }
            >
              {currentStep === 1 && (
                <PersonalStep
                  form={personalForm}
                  showPass={showPass}
                  setShowPass={setShowPass}
                  pwStrength={pwStrength}
                  pwColors={pwColors}
                  pwLabels={pwLabels}
                  roles={roles}
                  rolesLoading={rolesLoading}
                />
              )}

              {currentStep === 2 && <SchoolStep form={schoolForm} />}

              <FormNavigation
                currentStep={currentStep}
                loading={loading}
                isPersonalStepComplete={isPersonalStepComplete}
                isSchoolStepComplete={isSchoolStepComplete}
                onPrev={prevStep}
                onNext={nextStep}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
