import { useState, useCallback, useEffect } from "react";
import {
  studentApis,
  Student as ApiStudent,
  RecordStatus,
} from "@/lib/api/Student";
import { Student } from "@/components/tables/StudentTable";

interface UseStudentDataParams {
  currentPage: number;
  pageSize: number;
  searchParams?: {
    search?: string;
    status?: RecordStatus;
    classId?: string | string[];
    sectionId?: string;
    gender?: string | string[];
    academicYearId?: string;
    fromDate?: string;
    toDate?: string;
    fromFamilyIncome?: number;
    toFamilyIncome?: number;
  };
  onTotalCountChange?: (count: number) => void;
}

export function UseStudentData({
  currentPage,
  pageSize,
  searchParams,
  onTotalCountChange,
}: UseStudentDataParams) {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const page = Math.max(1, Number(currentPage) || 1);
      const limit = Math.max(1, Number(pageSize) || 10);

      const response = await studentApis.getAll({
        page,
        limit,
        search: searchParams?.search,
        status: searchParams?.status,
        classId: searchParams?.classId,
        sectionId: searchParams?.sectionId,
        gender: searchParams?.gender,
        academicYearId: searchParams?.academicYearId,
        fromDate: searchParams?.fromDate,
        toDate: searchParams?.toDate,
        fromFamilyIncome: searchParams?.fromFamilyIncome,
        toFamilyIncome: searchParams?.toFamilyIncome,
      });

      if (response.data && response.data.data) {
        const transformedStudents = response.data.data
          .filter(
            (apiStudent: ApiStudent) =>
              apiStudent.status.toLowerCase() !== "deleted",
          )
          .map((apiStudent: ApiStudent) => {
            // Check if student has any academic records (class assignments)
            const hasClassAssignment =
              apiStudent.academics && apiStudent.academics.length > 0;
            const currentAcademic = hasClassAssignment
              ? apiStudent.academics[0]
              : null;

            return {
              id: apiStudent.id,
              firstName: apiStudent.user.firstName,
              middleName: apiStudent.user.middleName,
              lastName: apiStudent.user.lastName,
              email: apiStudent.user.email,
              phone: apiStudent.user.phone,
              rollNo: currentAcademic?.rollNo || apiStudent.rollNo,
              admissionDate: apiStudent.admissionDate,
              class: currentAcademic
                ? `${currentAcademic.class.className}-${currentAcademic.class.section}`
                : "Unassigned",
              classId: currentAcademic?.class.id,
              academicYear: currentAcademic?.academicYear.yearName,
              academicYearId: currentAcademic?.academicYear.id,
              dob: apiStudent.user.dob || "N/A",
              gender: apiStudent.user.gender || null,
              guardian: apiStudent.guardianName || "N/A",
              status: apiStudent.status
                ? apiStudent.status.charAt(0).toUpperCase() +
                  apiStudent.status.slice(1)
                : "Unknown",
              fatherName: apiStudent.fatherName || "",
              fatherPhone: apiStudent.fatherPhone || "",
              motherName: apiStudent.motherName || "",
              guardianName: apiStudent.guardianName || "",
              familyAnnualIncome: apiStudent.familyAnnualIncome || "",
              medicalConditions: apiStudent.medicalConditions || "",

              // Extract fields from user object
              bloodGroup: apiStudent.user.bloodGroup || "",
              aadhaarNo: apiStudent.user.aadhaarNo || "",
              panNo: apiStudent.user.panNo || "",
              permanentAddress: apiStudent.user.permanentAddress || "",
              currentAddress: apiStudent.user.currentAddress || "",
              bankName: apiStudent.user.bankName || "",
              accountNo: apiStudent.user.accountNo || "",
              ifscCode: apiStudent.user.ifscCode || "",
              branch: apiStudent.user.branch || "",
            };
          });

        setStudents(transformedStudents);
        setTotalStudents(response.data.meta.total);
        onTotalCountChange?.(response.data.meta.total);
      } else {
        setError("Error");
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as { message?: string })?.message ||
        "Failed to fetch students";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchParams?.search,
    searchParams?.status,
    searchParams?.classId,
    searchParams?.sectionId,
    searchParams?.gender,
    searchParams?.academicYearId,
    searchParams?.fromDate,
    searchParams?.toDate,
    searchParams?.fromFamilyIncome,
    searchParams?.toFamilyIncome,
    onTotalCountChange,
  ]);

  // Auto-fetch students when dependencies change
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    totalStudents,
    loading,
    error,
    fetchStudents,
  };
}
