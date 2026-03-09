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
} from "@/lib/validations/SignUpSchema";
import { StepProgress } from "@/components/forms/StepProgress";
import { FormNavigation } from "@/components/forms/FormNavigation";
import { useFormCompletion } from "@/lib/hooks/UseFormCompletion";
import { useFormPersistence } from "@/lib/hooks/UseFormPersistence";

import { PersonalStep } from "@/components/forms/PersonalStep";
import { SchoolStep } from "@/components/forms/SchoolStep";
import { PW_COLORS, PW_LABELS } from "@/lib/utils/SignupConstants";
import { authApi, Role, RegisterSchoolPayload } from "@/lib/api/Auth";
import { showToast } from "@/lib/utils/Toast";
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
    mode: "onSubmit",
    defaultValues: {
      firstName: "",
      middleName: undefined,
      lastName: "",
      email: "",
      phone: "",
      password: "",
      roleId: "",
    },
  });

  const schoolForm = useForm<SchoolDetails>({
    resolver: zodResolver(schoolDetailsSchema),
    mode: "onSubmit",
    defaultValues: {
      schoolName: "",
      schoolType: undefined,
      address: "",
      officialEmail: "",
      contactNumber: "",
      mediumOfInstruction: undefined,
      affiliationBoard: undefined,
      schoolCode: undefined,
      establishmentYear: undefined,
      adminEmail: undefined,
      websiteUrl: undefined,
    },
  });

  const { isPersonalStepComplete, isSchoolStepComplete } = useFormCompletion(
    personalForm,
    schoolForm,
  );

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

  const { clearPersistence } = useFormPersistence({
    personalForm,
    schoolForm,
    currentStep,
    setCurrentStep,
  });
  useEffect(() => {
    const controller = new AbortController();
    const fetchRoles = async () => {
      setRolesLoading(true);
      try {
        const response = await authApi.getRoles();
        if (
          response.statusCode === 200 &&
          response.data &&
          !controller.signal.aborted
        ) {
          setRoles(response.data);

          // Find admin role and store in localStorage
          const adminRole = response.data.find(
            (role: Role) => role.roleName.toLowerCase() === "admin",
          );
          if (adminRole) {
            localStorage.setItem("roleId", adminRole.id);
            personalForm.setValue("roleId", adminRole.id);
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          showToast.apiError(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setRolesLoading(false);
        }
      }
    };
    fetchRoles();
    return () => controller.abort();
  }, [personalForm]);

  const nextStep = async () => {
    const isValid = await personalForm.trigger();
    if (isValid && isPersonalStepComplete) setCurrentStep(2);
  };

  const prevStep = () => setCurrentStep(1);

  const handleSubmit = async () => {
    // Only validate required fields, not optional ones
    const requiredFields = [
      "schoolName",
      "schoolType",
      "address",
      "officialEmail",
      "contactNumber",
      "mediumOfInstruction",
      "affiliationBoard",
    ] as const;

    const isValid = await schoolForm.trigger(requiredFields);
    if (!isValid) return;
    setLoading(true);

    try {
      const personalDetails = { ...personalForm.getValues() };
      const schoolData = { ...schoolForm.getValues() };

      // Clean phone numbers
      if (personalDetails.phone) {
        personalDetails.phone = personalDetails.phone.replace(/[^\d]/g, "");
      }
      if (schoolData.contactNumber) {
        schoolData.contactNumber = schoolData.contactNumber.replace(
          /[^\d]/g,
          "",
        );
      }

      // Create the combined payload for the new API
      const registerPayload: RegisterSchoolPayload = {
        firstName: personalDetails.firstName,
        lastName: personalDetails.lastName,
        email: personalDetails.email,
        password: personalDetails.password,
        roleId: personalDetails.roleId,
        name: schoolData.schoolName,
        address: schoolData.address,
      };

      // Only add optional fields if they have values
      if (personalDetails.middleName) {
        registerPayload.middleName = personalDetails.middleName;
      }
      if (personalDetails.phone) {
        registerPayload.phone = personalDetails.phone;
      }
      if (schoolData.affiliationBoard) {
        registerPayload.affiliationBoard = schoolData.affiliationBoard;
      }
      if (schoolData.establishmentYear) {
        registerPayload.establishmentYear = schoolData.establishmentYear;
      }
      if (schoolData.schoolCode) {
        registerPayload.schoolCode = schoolData.schoolCode;
      }
      if (schoolData.contactNumber) {
        registerPayload.contact = schoolData.contactNumber;
      }
      if (schoolData.officialEmail) {
        registerPayload.emailOfficial = schoolData.officialEmail;
      }
      if (schoolData.adminEmail) {
        registerPayload.emailAdmin = schoolData.adminEmail;
      }
      if (schoolData.websiteUrl) {
        registerPayload.websiteUrl = schoolData.websiteUrl;
      }
      if (schoolData.mediumOfInstruction) {
        registerPayload.mediumOfInstruction = schoolData.mediumOfInstruction;
      }
      if (schoolData.schoolType) {
        registerPayload.type = schoolData.schoolType;
      }

      const response = await authApi.registerSchool(registerPayload);

      if (response.data) {
        const responseData = response.data;

        // Store tokens
        if (responseData.accessToken) {
          localStorage.setItem("accessToken", responseData.accessToken);
        }
        if (responseData.refreshToken) {
          localStorage.setItem("refreshToken", responseData.refreshToken);
        }

        // Store user data
        if (responseData.user) {
          localStorage.setItem("user", JSON.stringify(responseData.user));
          if (responseData.user.email) {
            localStorage.setItem("userEmail", responseData.user.email);
          }
          if (responseData.user.id) {
            localStorage.setItem("userId", responseData.user.id);
          }
          if (responseData.user.role) {
            localStorage.setItem("userRole", responseData.user.role);
          }
          if (responseData.user.roleId) {
            localStorage.setItem("userRoleId", responseData.user.roleId);
          }
        }

        // Store school ID
        if (responseData.user?.schoolId) {
          localStorage.setItem("schoolId", responseData.user.schoolId);
        }

        // Also store the complete response data as a backup
      }

      showToast.success("Sign up successfully");

      // Clear persistence data on success
      clearPersistence();

      // Clear all signup-related localStorage data
      localStorage.removeItem("signup_personal_details");
      localStorage.removeItem("signup_school_details");
      localStorage.removeItem("signup_current_step");

      router.replace("/dashboard");
    } catch (error: unknown) {
      // Handle API errors specifically
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = error as {
          response?: { data?: { message?: string } };
        };
        if (errorResponse.response?.data?.message) {
          showToast.error(errorResponse.response.data.message);
        } else {
          showToast.apiError(error);
        }
      } else {
        showToast.apiError(error);
      }
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
              <span className="text-[var(--text-inverse)]/50 font-normal">
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
                  : e => {
                      e.preventDefault();
                      handleSubmit();
                    }
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
