"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  Heart,
  Hash,
  IndianRupee,
} from "lucide-react";
import {
  createStudentSchema,
  updateStudentSchema,
  StudentFormValues,
  STUDENT_FIELDS,
} from "@/lib/validations/StudentSchema";
import { studentApis } from "@/lib/api/Student";
import { classApis, Class, AcademicYear } from "@/lib/api/Class";
import { showToast } from "@/lib/utils/Toast";
import { generateStudentPassword } from "@/lib/utils/PasswordGenerator";
import {
  handleStringField,
  handleNonStringField,
} from "@/lib/utils/FieldHandlers";
import DateInput from "@/components/ui/DateInput";

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
  const isEditMode = !!initialData;
  const [classes, setClasses] = useState<Class[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [fetchingData, setFetchingData] = useState(false);

  // Icon mapping for different fields
  const getFieldIcon = (fieldName: string) => {
    switch (fieldName) {
      case "firstName":
      case "middleName":
      case "lastName":
      case "gender":
        return Users;
      case "email":
        return Mail;
      case "phone":
      case "fatherPhone":
        return Phone;
      case "admissionDate":
        return Calendar;
      case "fatherName":
      case "motherName":
      case "guardianName":
        return Users;
      case "familyAnnualIncome":
        return IndianRupee;
      case "medicalConditions":
        return Heart;
      case "admissionNo":
      case "rollNo":
        return Hash;
      default:
        return User;
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(
      isEditMode ? updateStudentSchema : createStudentSchema,
    ),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phone: "",
      rollNo: "",
      admissionDate: "",
      dob: undefined,
      fatherName: "",
      fatherPhone: "",
      motherName: "",
      guardianName: "",
      familyAnnualIncome: "",
      medicalConditions: "",
      gender: "",
      classId: "",
      academicYearId: "",
    },
    mode: "onSubmit",
  });

  const [hasChanges, setHasChanges] = useState(false);
  const formData = watch();

  // Monitor form changes to enable/disable submit button
  useEffect(() => {
    if (isEditMode && initialData) {
      const changedStudentFields = getChangedFields(formData, initialData);

      // Check academic assignment changes (normalize undefined/null to "" for comparison)
      const academicChanged =
        (formData.classId || "") !== (initialData.classId || "") ||
        (formData.academicYearId || "") !== (initialData.academicYearId || "");

      const rollNoChanged =
        (formData.rollNo || "") !== (initialData.rollNo || "");

      const hasAnyChanges =
        Object.keys(changedStudentFields).length > 0 ||
        academicChanged ||
        rollNoChanged;

      setHasChanges(hasAnyChanges);
    } else {
      // For create mode, always enable if form has required fields
      setHasChanges(
        !!formData.firstName && !!formData.lastName && !!formData.email,
      );
    }
  }, [formData, initialData, isEditMode]);

  useEffect(() => {
    if (initialData) {
      // Create a clean form data object without user property
      const formDataToReset: Partial<StudentFormValues> = {
        firstName: initialData.firstName,
        middleName: initialData.middleName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        rollNo: initialData.rollNo,
        admissionDate: initialData.admissionDate,
        dob: initialData.dob,
        gender: (initialData.gender as "male" | "female" | "other" | "") || "",
        fatherName: initialData.fatherName,
        fatherPhone: initialData.fatherPhone,
        motherName: initialData.motherName,
        guardianName: initialData.guardianName,
        familyAnnualIncome: initialData.familyAnnualIncome
          ? Math.floor(Number(initialData.familyAnnualIncome)).toString()
          : "",
        medicalConditions: initialData.medicalConditions,
      };
      reset(formDataToReset);
    }
  }, [initialData, reset, setValue]);

  // Handle academic year change
  const handleAcademicYearChange = (academicYearId: string) => {
    setSelectedAcademicYear(academicYearId);

    if (academicYearId) {
      // For now, show all classes (you can filter by academic year if the API supports it)
      setFilteredClasses(classes);

      // Don't clear class selection as the relationship might be managed on the backend
    } else {
      setFilteredClasses([]);
      setValue("classId", "");
    }
  };

  // Fetch classes and academic years for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);

        // Fetch academic years and classes in parallel
        const [academicYearsData, classesData] = await Promise.all([
          classApis.getAcademicYears(),
          classApis.getAll(),
        ]);

        setAcademicYears(academicYearsData);
        setClasses(classesData);

        // Set initial values if in edit mode
        if (isEditMode && initialData) {
          if (initialData.academicYearId) {
            setValue("academicYearId", initialData.academicYearId);
            setSelectedAcademicYear(initialData.academicYearId);

            // Show all classes for now
            setFilteredClasses(classesData);
          }
          if (initialData.classId) {
            setValue("classId", initialData.classId);
          }
        }
      } catch {
        showToast.error("Failed to fetch data");
      } finally {
        setFetchingData(false);
      }
    };

    fetchData();
  }, [isEditMode, initialData, setValue]);

  // Define proper interface for student creation payload
  interface CreateStudentPayload {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    rollNo: string;
    admissionDate: string;
    dob?: string;
    fatherName?: string;
    fatherPhone?: string;
    motherName?: string;
    guardianName?: string;
    familyAnnualIncome?: number;
    medicalConditions?: string;
    classId?: string;
    academicYearId?: string;
    roleId: string;
    schoolId: string;
    academic?: {
      classId: string;
      academicYearId: string;
      rollNo?: string | null;
    };
  }

  // Function to get only changed fields
  const getChangedFields = (
    formData: StudentFormValues,
    initialData: Partial<StudentFormValues> & {
      id?: string;
      classId?: string;
      academicYearId?: string;
      isAssigned?: boolean;
      className?: string;
    },
  ) => {
    const changedFields: Partial<StudentFormValues> = {};

    // Compare each field with initial data
    Object.keys(formData).forEach(key => {
      const formValue = formData[key as keyof StudentFormValues];
      const initialValue = initialData?.[key as keyof typeof initialData];

      // Special handling for familyAnnualIncome due to number/string conversion
      if (key === "familyAnnualIncome") {
        const formNum = formValue ? parseInt(formValue) : undefined;
        const initialNum =
          initialValue !== undefined && initialValue !== ""
            ? Math.floor(Number(initialValue))
            : undefined;

        if (formNum !== initialNum) {
          if (formValue !== undefined && formValue !== "") {
            changedFields.familyAnnualIncome = formValue;
          }
        }
        return;
      }

      // Normalize undefined/null to "" for consistent comparison
      const normalizedFormValue = formValue ?? "";
      const normalizedInitialValue = initialValue ?? "";

      // Handle different types of comparisons for other fields
      if (normalizedFormValue !== normalizedInitialValue) {
        // For string fields, check if both are empty/null/undefined
        if (
          typeof normalizedFormValue === "string" &&
          typeof normalizedInitialValue === "string"
        ) {
          if (normalizedFormValue.trim() !== normalizedInitialValue.trim()) {
            // Handle other string fields
            handleStringField(key, normalizedFormValue, changedFields);
          }
        } else {
          // Handle non-string fields
          handleNonStringField(key, normalizedFormValue, changedFields);
        }
      }
    });

    return changedFields;
  };

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        showToast.error("School ID not found. Please login again.");
        return;
      }

      // Convert familyAnnualIncome from string to number if present
      const processedData = {
        ...data,
        familyAnnualIncome: data.familyAnnualIncome
          ? parseInt(data.familyAnnualIncome)
          : undefined,
      };

      if (isEditMode) {
        if (!initialData?.id) {
          showToast.error("Student ID is required for update");
          return;
        }

        // Prepare update payload with only student data changes (exclude academic fields)
        const { classId, academicYearId, rollNo, ...studentFieldsOnly } =
          processedData;
        const {
          classId: initialClassId,
          academicYearId: initialAcademicYearId,
          rollNo: initialRollNo,
        } = initialData;

        // Check if academic assignment changed
        const academicChanged =
          classId !== initialClassId ||
          academicYearId !== initialAcademicYearId;

        const rollNoChanged = rollNo !== initialRollNo;

        const changedStudentFields = getChangedFields(
          studentFieldsOnly as StudentFormValues,
          initialData,
        );

        // Prepare update payload with only student data changes (exclude academic fields)
        const updatePayload: Partial<StudentFormValues> & {
          academic?: {
            classId: string;
            academicYearId: string;
            rollNo?: string | null;
          };
        } = { ...changedStudentFields };

        // Handle academic assignment separately
        let academicPayload:
          | {
              classId: string;
              academicYearId: string;
              rollNo?: string | null;
            }
          | undefined;

        // Add academic assignment only if it changed and both classId and academicYearId are provided
        if (academicChanged && classId && academicYearId) {
          academicPayload = {
            classId: classId,
            academicYearId: academicYearId,
          };

          // Only include rollNo if it changed
          if (rollNoChanged) {
            academicPayload.rollNo = rollNo || null;
          }
        } else if (
          !academicChanged &&
          rollNoChanged &&
          classId &&
          academicYearId
        ) {
          // Only rollNo changed, include just that with current class and academic year
          academicPayload = {
            classId: classId,
            academicYearId: academicYearId,
            rollNo: rollNo || null,
          };
        }
        // Note: If academic assignment was completely removed (academicChanged && !classId && !academicYearId),
        // we don't send academic payload since the backend handles removal differently

        // Add academic payload to update request if it exists
        if (academicPayload) {
          updatePayload.academic = academicPayload;
        }

        await studentApis.updateStudent(initialData.id, updatePayload);
        showToast.success("Student updated successfully!");
      } else {
        // Create payload with converted familyAnnualIncome and auto-generated password
        const { classId, academicYearId, rollNo, ...studentData } = data;

        // Generate password for new student
        const generatedPassword = generateStudentPassword();

        const payload: CreateStudentPayload = {
          ...studentData,
          password: generatedPassword,
          rollNo: rollNo || "",
          familyAnnualIncome: data.familyAnnualIncome
            ? parseInt(data.familyAnnualIncome)
            : undefined,
          roleId,
          schoolId,
        };

        // If class assignment is provided, add it to payload
        if (classId && academicYearId) {
          payload.academic = {
            classId,
            academicYearId,
            rollNo: rollNo || null,
          };
        }

        await studentApis.addStudent(payload);
        showToast.success("Student admitted successfully!");
      }

      onSubmitSuccess?.();
      onClose();
    } catch (error) {
      showToast.apiError(error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5 auto-rows-auto">
          {(() => {
            const filteredFields = STUDENT_FIELDS; // No filtering needed since password is removed from STUDENT_FIELDS

            const fieldsBySection = filteredFields.reduce(
              (acc, field) => {
                const section = field.section || "Other";
                if (!acc[section]) acc[section] = [];
                acc[section].push(field);
                return acc;
              },
              {} as Record<string, typeof filteredFields>,
            );

            return Object.entries(fieldsBySection).map(([section, fields]) => (
              <React.Fragment key={section}>
                {/* Section Header */}
                <div className="md:col-span-2 col-span-1">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4 pb-2 border-b border-[var(--border)]">
                    {section}
                  </h3>
                </div>

                {/* Section Fields */}
                {fields.map(field => {
                  const error = errors[field.name];
                  const isFullWidth = field.fullWidth;

                  if (field.type === "date") {
                    return (
                      <div
                        key={field.name}
                        className={
                          isFullWidth
                            ? "md:col-span-2 col-span-1"
                            : "md:col-span-1 col-span-1"
                        }
                      >
                        <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                          {field.label}
                          {!field.optional && (
                            <span className="text-[var(--rose)] ml-0.5">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <DateInput
                            {...register(field.name)}
                            id={field.name}
                            error={error?.message}
                            className="w-full px-3.5 py-2.5 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)]"
                          />
                        </div>
                      </div>
                    );
                  }

                  if (field.type === "classAssignment") {
                    return (
                      <div
                        key={field.name}
                        className={
                          isFullWidth
                            ? "md:col-span-2 col-span-1"
                            : "md:col-span-1 col-span-1"
                        }
                      >
                        <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                          {field.label}
                          {!field.optional && (
                            <span className="text-[var(--rose)] ml-0.5">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <div className="group relative">
                            <select
                              {...register(field.name, {
                                onChange: e => {
                                  if (field.name === "academicYearId") {
                                    handleAcademicYearChange(e.target.value);
                                  }
                                },
                              })}
                              disabled={
                                fetchingData ||
                                (field.name === "classId" &&
                                  !selectedAcademicYear)
                              }
                              className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] disabled:opacity-50 cursor-pointer ${
                                error
                                  ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                                  : "border-[var(--border)]"
                              }`}
                            >
                              <option value="">
                                {fetchingData
                                  ? "Loading..."
                                  : field.placeholder}
                              </option>
                              {field.name === "academicYearId" &&
                                academicYears.map(year => (
                                  <option key={year.id} value={year.id}>
                                    {year.yearName}{" "}
                                    {year.isCurrent && "(Current)"} -{" "}
                                    {year.status}
                                  </option>
                                ))}
                              {field.name === "classId" &&
                                filteredClasses.map(cls => (
                                  <option key={cls.id} value={cls.id}>
                                    Class {cls.className} - {cls.section}
                                    {cls.studentCapacity &&
                                      ` (Capacity: ${cls.studentCapacity})`}
                                    {cls.status === "inactive" && " (Inactive)"}
                                  </option>
                                ))}
                            </select>
                            {field.name === "classId" &&
                              !selectedAcademicYear && (
                                <div className="absolute bottom-full left-0 mb-2 px-3 py-1 text-xs text-[var(--text)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                  Select academic year first
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--border)]"></div>
                                </div>
                              )}
                          </div>
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        {error && (
                          <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                            {error.message}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (field.type === "select") {
                    return (
                      <div
                        key={field.name}
                        className={
                          isFullWidth
                            ? "md:col-span-2 col-span-1"
                            : "md:col-span-1 col-span-1"
                        }
                      >
                        <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                          {field.label}
                          {!field.optional && (
                            <span className="text-[var(--rose)] ml-0.5">*</span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            {...register(field.name)}
                            value={watch(field.name) || ""}
                            className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer ${
                              error
                                ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                                : "border-[var(--border)]"
                            }`}
                          >
                            {/* Hide placeholder if in edit mode and gender already exists in original data */}
                            {!(
                              isEditMode &&
                              field.name === "gender" &&
                              initialData?.gender
                            ) && (
                              <option value="">
                                {field.name === "gender"
                                  ? "Select gender"
                                  : field.placeholder}
                              </option>
                            )}
                            {field.name === "gender" ? (
                              <>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </>
                            ) : null}
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                            <Users className="w-4 h-4" />
                          </div>
                        </div>
                        {error && (
                          <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                            {error.message}
                          </p>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={field.name}
                      className={
                        isFullWidth
                          ? "md:col-span-2 col-span-1"
                          : "md:col-span-1 col-span-1"
                      }
                    >
                      <label className="block text-xs font-bold text-[var(--text)] mb-1.5 uppercase tracking-wide">
                        {field.label}
                        {!field.optional && (
                          <span className="text-[var(--rose)] ml-0.5">*</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type={field.type === "tel" ? "tel" : field.type}
                          placeholder={field.placeholder}
                          {...register(field.name)}
                          className={`w-full px-3.5 py-2.5 pl-10 text-sm text-[var(--text)] bg-[var(--surface-2)] border rounded-[var(--radius-sm)] outline-none transition-colors duration-[var(--duration)] placeholder:text-[var(--text-3)] focus:bg-[var(--surface)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] ${
                            error
                              ? "border-[var(--rose)] bg-[var(--rose-light)] focus:border-[var(--rose)] focus:ring-[var(--rose-muted)]"
                              : "border-[var(--border)]"
                          }`}
                          onInput={
                            field.type === "tel" || field.name.includes("phone")
                              ? e => {
                                  const value = e.currentTarget.value;
                                  // Only allow numbers, max 10 digits
                                  const numericValue = value
                                    .replace(/\D/g, "")
                                    .slice(0, 10);
                                  if (value !== numericValue) {
                                    e.currentTarget.value = numericValue;
                                  }
                                }
                              : field.name === "rollNo"
                                ? e => {
                                    const value = e.currentTarget.value;
                                    // Only allow numbers
                                    const numericValue = value.replace(
                                      /\D/g,
                                      "",
                                    );
                                    if (value !== numericValue) {
                                      e.currentTarget.value = numericValue;
                                    }
                                  }
                                : field.name === "familyAnnualIncome"
                                  ? e => {
                                      const value = e.currentTarget.value;
                                      // Only allow numbers
                                      const numericValue = value.replace(
                                        /\D/g,
                                        "",
                                      );
                                      if (value !== numericValue) {
                                        e.currentTarget.value = numericValue;
                                      }
                                    }
                                  : undefined
                          }
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)] pointer-events-none">
                          {(() => {
                            const Icon = getFieldIcon(field.name);
                            return <Icon className="w-4 h-4" />;
                          })()}
                        </div>
                      </div>
                      {error && (
                        <p className="mt-1 text-xs font-medium text-[var(--rose)]">
                          {error.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ));
          })()}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={handleCancel}
            className="px-5 cursor-pointer py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] transition-colors duration-[var(--duration)] h-[52px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting || fetchingData || (isEditMode && !hasChanges)
            }
            className={`btn-primary px-5 h-auto py-2 text-sm rounded-[var(--radius-sm)] ${
              isSubmitting || fetchingData || (isEditMode && !hasChanges)
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Student"
                : "Admit Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
