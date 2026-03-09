"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createStudentSchema,
  updateStudentSchema,
  StudentFormValues,
} from "../validations/StudentSchema";
import { studentApis } from "../api/Student";
import { classApis, Class, AcademicYear } from "../api/Class";
import { showToast } from "../utils/Toast";
import { generateStudentPassword } from "../utils/PasswordGenerator";
import { handleStringField } from "../utils/FieldHandlers";

interface UseStudentFormProps {
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
  bloodGroup?: string;
  aadhaarNo?: string;
  panNo?: string;
  permanentAddress?: string;
  currentAddress?: string;
  bankName?: string;
  accountNo?: string;
  ifscCode?: string;
  branch?: string;
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

export function UseStudentForm({
  initialData,
  onSubmitSuccess,
  onClose,
  roleId,
}: UseStudentFormProps) {
  const isEditMode = !!initialData;
  const [classes, setClasses] = useState<Class[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>("");
  const [fetchingData, setFetchingData] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      bloodGroup: "",
      aadhaarNo: "",
      panNo: "",
      permanentAddress: "",
      currentAddress: "",
      bankName: "",
      accountNo: "",
      ifscCode: "",
      branch: "",
      gender: "",
      classId: "",
      academicYearId: "",
      password: "",
      sameAsPermanent: false,
    },
    mode: "onSubmit",
  });

  const formData = watch();
  const sameAsPermanent = watch("sameAsPermanent");

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

    Object.keys(formData).forEach(key => {
      const formValue = formData[key as keyof StudentFormValues];
      const initialValue = initialData?.[key as keyof typeof initialData];

      if (key === "familyAnnualIncome") {
        const formNum = formValue ? parseInt(formValue as string) : undefined;
        const initialNum =
          initialValue !== undefined && initialValue !== ""
            ? Math.floor(Number(initialValue))
            : undefined;

        if (formNum !== initialNum) {
          changedFields.familyAnnualIncome = (formValue as string) || "";
        }
        return;
      }

      if (key === "sameAsPermanent") {
        // Skip sameAsPermanent - it's UI only and shouldn't go to API
        return;
      }

      // Normalize both values using ?? "" to treat undefined, null, and "" consistently
      const normalizedFormValue = (formValue ?? "") as string;
      const normalizedInitialValue = (initialValue ?? "") as string;

      // Check if form value is empty after normalization
      const formIsEmpty = normalizedFormValue === "";
      // Check if initial value was empty after normalization
      const initialIsEmpty = normalizedInitialValue === "";

      // If both are empty, no change
      if (formIsEmpty && initialIsEmpty) {
        return;
      }

      // If form is empty but initial had value, it's a change (send null for optional fields)
      if (formIsEmpty && !initialIsEmpty) {
        const optionalFields = [
          "middleName",
          "phone",
          "password",
          "dob",
          "fatherName",
          "fatherPhone",
          "motherName",
          "guardianName",
          "familyAnnualIncome",
          "medicalConditions",
          "bloodGroup",
          "aadhaarNo",
          "panNo",
          "permanentAddress",
          "currentAddress",
          "bankName",
          "accountNo",
          "ifscCode",
          "branch",
          "gender",
        ];

        if (optionalFields.includes(key)) {
          (changedFields as Partial<StudentFormValues> & Record<string, null>)[
            key
          ] = null;
        } else {
          handleStringField(key, "", changedFields);
        }
        return;
      }

      // If form has value but initial was empty, it's a change
      if (!formIsEmpty && initialIsEmpty) {
        handleStringField(key, normalizedFormValue, changedFields);
        return;
      }

      // Both have values, compare them
      if (normalizedFormValue.trim() !== normalizedInitialValue.trim()) {
        handleStringField(key, normalizedFormValue, changedFields);
      }
    });

    return changedFields;
  };

  const handleGeneratePassword = () => {
    const generatedPassword = generateStudentPassword();
    setValue("password", generatedPassword);
    setShowPassword(true);
    showToast.success("Password generated successfully!");
  };

  useEffect(() => {
    if (sameAsPermanent) {
      setValue("permanentAddress", formData.currentAddress);
    }
  }, [sameAsPermanent, formData.currentAddress, setValue]);

  useEffect(() => {
    if (isEditMode && initialData) {
      const changedStudentFields = getChangedFields(formData, initialData);

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
      setHasChanges(
        !!formData.firstName && !!formData.lastName && !!formData.email,
      );
    }
  }, [formData, initialData, isEditMode]);

  useEffect(() => {
    if (initialData) {
      const formDataToReset: Partial<StudentFormValues> = {
        firstName: initialData.firstName,
        middleName: initialData.middleName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        rollNo: initialData.rollNo,
        admissionDate: initialData.admissionDate,
        dob: initialData.dob,
        gender:
          ((initialData.gender || initialData.user?.gender) as
            | "male"
            | "female"
            | "other"
            | "") || "",
        fatherName: initialData.fatherName,
        fatherPhone: initialData.fatherPhone,
        motherName: initialData.motherName,
        guardianName: initialData.guardianName,
        familyAnnualIncome: initialData.familyAnnualIncome
          ? Math.floor(Number(initialData.familyAnnualIncome)).toString()
          : "",
        medicalConditions: initialData.medicalConditions,
        bloodGroup: initialData.bloodGroup || "",
        aadhaarNo: initialData.aadhaarNo || "",
        panNo: initialData.panNo || "",
        permanentAddress: initialData.permanentAddress || "",
        currentAddress: initialData.currentAddress || "",
        bankName: initialData.bankName || "",
        accountNo: initialData.accountNo || "",
        ifscCode: initialData.ifscCode || "",
        branch: initialData.branch || "",
        password: initialData.password || "",
      };
      reset(formDataToReset);
    }
  }, [initialData, reset, setValue]);

  const handleAcademicYearChange = (academicYearId: string) => {
    setSelectedAcademicYear(academicYearId);

    if (academicYearId) {
      setFilteredClasses(classes);
    } else {
      setFilteredClasses([]);
      setValue("classId", "");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true);

        const [academicYearsData, classesData] = await Promise.all([
          classApis.getAcademicYears(),
          classApis.getAll(),
        ]);

        setAcademicYears(academicYearsData);
        setClasses(classesData);

        if (isEditMode && initialData) {
          if (initialData.academicYearId) {
            setValue("academicYearId", initialData.academicYearId);
            setSelectedAcademicYear(initialData.academicYearId);

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

  const onSubmit = async (data: StudentFormValues) => {
    try {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) {
        showToast.error("School ID not found. Please login again.");
        return;
      }

      if (isEditMode) {
        if (!initialData?.id) {
          showToast.error("Student ID is required for update");
          return;
        }

        const { classId, academicYearId, rollNo, ...studentFieldsFromForm } =
          data;

        const {
          classId: initialClassId,
          academicYearId: initialAcademicYearId,
          rollNo: initialRollNo,
        } = initialData;

        const academicChanged =
          classId !== (initialClassId || "") ||
          academicYearId !== (initialAcademicYearId || "");

        const rollNoChanged = rollNo !== (initialRollNo || "");

        const changedStudentFields = getChangedFields(
          studentFieldsFromForm as StudentFormValues,
          initialData,
        );

        const updatePayload: Partial<StudentFormValues> & {
          academic?: {
            classId: string;
            academicYearId: string;
            rollNo?: string | null;
          };
        } = { ...changedStudentFields };

        let academicPayload:
          | {
              classId: string;
              academicYearId: string;
              rollNo?: string | null;
            }
          | undefined;

        if (academicChanged && classId && academicYearId) {
          academicPayload = {
            classId: classId,
            academicYearId: academicYearId,
          };

          if (rollNoChanged) {
            academicPayload.rollNo = rollNo || null;
          }
        } else if (
          !academicChanged &&
          rollNoChanged &&
          classId &&
          academicYearId
        ) {
          academicPayload = {
            classId: classId,
            academicYearId: academicYearId,
            rollNo: rollNo || null,
          };
        }
        if (academicPayload) {
          updatePayload.academic = academicPayload;
        }
        await studentApis.updateStudent(initialData.id, updatePayload);
        showToast.success("Student updated successfully!");
      } else {
        const {
          classId,
          academicYearId,
          rollNo,
          sameAsPermanent,
          ...studentData
        } = data;

        const payload: CreateStudentPayload = {
          ...studentData,
          password: data.password || "",
          rollNo: rollNo || "",
          familyAnnualIncome: data.familyAnnualIncome
            ? parseInt(data.familyAnnualIncome)
            : undefined,
          roleId,
          schoolId,
        };

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

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    watch,
    setValue,
    formData,
    sameAsPermanent,

    classes,
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
  };
}
