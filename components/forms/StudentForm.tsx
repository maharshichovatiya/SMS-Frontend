"use client";

import React from "react";
import { UseStudentForm } from "@/lib/hooks/UseStudentForm";
import StudentFormFields from "@/components/forms/StudentFormFields";
import StudentAddressSection from "@/components/forms/StudentAddressSection";
import StudentFormActions from "@/components/forms/StudentFormActions";
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
    fetchingData,
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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <StudentFormFields
          register={register}
          watch={watch}
          errors={errors}
          academicYears={academicYears}
          filteredClasses={filteredClasses}
          selectedAcademicYear={selectedAcademicYear}
          fetchingData={fetchingData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleGeneratePassword={handleGeneratePassword}
          handleAcademicYearChange={handleAcademicYearChange}
          isEditMode={isEditMode}
          initialData={initialData}
        />

        <StudentAddressSection
          register={register}
          errors={errors}
          sameAsPermanent={sameAsPermanent || false}
        />

        <StudentFormActions
          isSubmitting={isSubmitting}
          fetchingData={fetchingData}
          isEditMode={isEditMode}
          hasChanges={hasChanges}
          onCancel={handleCancel}
        />
      </form>
    </div>
  );
}
