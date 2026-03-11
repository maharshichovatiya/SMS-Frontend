"use client";

import React from "react";
import { UseStudentForm } from "@/lib/hooks/UseStudentForm";
import PersonalDetailsSection from "./PersonalDetailsSection";
import AcademicDetailsSection from "./AcademicDetailsSection";
import FamilyDetailsSection from "./FamilyDetailsSection";
import BankDetailsSection from "./BankDetailsSection";
import StudentAddressSection from "./StudentAddressSection";
import StudentFormActions from "./StudentFormActions";
import { StudentFormValues } from "@/lib/validations/StudentSchema";

interface StudentFormProps {
  initialData?: Partial<StudentFormValues> & {
    id?: string;
    classId?: string;
    academicYearId?: string;
    isAssigned?: boolean;
    className?: string;
    user?: {
      gender?: string;
    };
  };
  onSubmitSuccess?: () => void;
  onClose: () => void;
  roleId: string;
}

export default function StudentForm({
  initialData,
  onSubmitSuccess,
  onClose,
  roleId,
}: StudentFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    sameAsPermanent,
    academicYears,
    filteredClasses,
    selectedAcademicYear,
    hasChanges,
    showPassword,
    setShowPassword,
    isEditMode,
    onSubmit,
    handleCancel,
    handleGeneratePassword,
    handleAcademicYearChange,
  } = UseStudentForm({
    initialData,
    onSubmitSuccess,
    onClose,
    roleId,
  });

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-6"
      >
        <PersonalDetailsSection
          register={register}
          watch={watch}
          errors={errors}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleGeneratePassword={handleGeneratePassword}
          isEditMode={isEditMode}
        />

        <AcademicDetailsSection
          register={register}
          errors={errors}
          academicYears={academicYears}
          filteredClasses={filteredClasses}
          handleAcademicYearChange={handleAcademicYearChange}
          selectedAcademicYear={selectedAcademicYear}
        />

        <FamilyDetailsSection register={register} errors={errors} />

        <BankDetailsSection register={register} errors={errors} />

        <StudentAddressSection
          register={register}
          errors={errors}
          sameAsPermanent={sameAsPermanent || false}
        />

        <StudentFormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          hasChanges={hasChanges}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}
