"use client";

import { useState } from "react";
import StudentTableSkeleton from "@/components/skeletons/StudentTableSkeleton";
import StudentTableRow from "./StudentTableRow";
import Pagination from "@/components/ui/Pagination";
import { UseStudentData } from "@/lib/hooks/UseStudentData";
import { UseStudentPagination } from "@/lib/hooks/UseStudentPagination";
import { showToast } from "@/lib/utils/Toast";
import { studentApis, RecordStatus } from "@/lib/api/Student";
import StudentEditModal from "@/components/students/Modals/StudentEditModal";
import StudentDeleteModal from "@/components/students/Modals/StudentDeleteModal";
import StudentAssignClassModal from "@/components/students/Modals/StudentAssignClassModal";
import StudentDetailsModal from "@/components/students/Modals/StudentDetailsModal";

export interface Student {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phone: string | null;
  rollNo: string;
  admissionDate: string;
  class: string;
  classId?: string;
  academicYear?: string;
  academicYearId?: string;
  dob: string | null;
  gender: string | null;
  guardian: string;
  status: string;

  fatherName: string;
  fatherPhone: string;
  motherName: string;
  guardianName: string;
  familyAnnualIncome: string;
  medicalConditions: string;

  // Missing fields from user object
  bloodGroup: string;
  aadhaarNo: string;
  panNo: string;
  permanentAddress: string;
  currentAddress: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
}

const DEFAULT_PAGE_SIZE = 5;

export default function StudentsTable({
  roleId,
  onRefresh,
  searchParams,
  onTotalCountChange,
}: {
  roleId: string;
  onRefresh?: () => void;
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
}) {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Custom hooks - order matters here, pagination first
  const { currentPage, setCurrentPage } = UseStudentPagination({
    searchParams,
    pageSize,
  });

  const { students, totalStudents, loading, error, fetchStudents } =
    UseStudentData({
      currentPage,
      pageSize,
      searchParams,
      onTotalCountChange,
    });

  const totalPages = Math.ceil(totalStudents / pageSize);
  const paginatedStudents = students;

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
  const [assigningClassStudent, setAssigningClassStudent] =
    useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleEdit = (student: Student) => setEditingStudent(student);
  const handleEditSuccess = () => {
    setEditingStudent(null);
    fetchStudents();
    onRefresh?.();
  };

  const handleDeleteClick = (student: Student) => setDeletingStudent(student);

  const handleAssignClass = (student: Student) =>
    setAssigningClassStudent(student);

  const handleViewStudent = (student: Student) => setViewingStudent(student);

  const handleClassAssignmentSuccess = () => {
    setAssigningClassStudent(null);
    fetchStudents();
    onRefresh?.();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await studentApis.deleteStudent(deletingStudent.id);
      fetchStudents(); // Refetch data instead of manipulating local state
      setDeletingStudent(null);
      showToast.apiSuccess("Deleted successfully");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to delete student";
      showToast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (student: Student) => {
    try {
      setTogglingStatus(student.id);
      const newStatus = student.status === "Active" ? "inactive" : "active";
      await studentApis.updateStudentStatus(student.id, newStatus);

      // Refetch data to get updated state
      fetchStudents();

      showToast.apiSuccess(
        `Student status updated to ${newStatus === "active" ? "Active" : "Inactive"}`,
      );
    } catch (error: unknown) {
      const errorObj = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorObj.response?.data?.message ||
        errorObj.message ||
        "Failed to update student status";
      showToast.error(errorMessage);
    } finally {
      setTogglingStatus(null);
    }
  };

  return (
    <>
      <StudentEditModal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        student={editingStudent}
        roleId={roleId}
        onSubmitSuccess={handleEditSuccess}
      />

      <StudentDeleteModal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        student={deletingStudent}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <StudentAssignClassModal
        isOpen={!!assigningClassStudent}
        onClose={() => setAssigningClassStudent(null)}
        student={assigningClassStudent}
        onSubmitSuccess={handleClassAssignmentSuccess}
      />

      <StudentDetailsModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />

      {loading ? (
        <StudentTableSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-[var(--rose)]">{error}</div>
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mb-4 cursor-pointer">
            <div className="text-2xl text-[var(--text-3)]">📚</div>
          </div>
          <p className="text-sm text-[var(--text-3)] text-center">
            No students found
          </p>
          <p className="text-xs text-[var(--text-4)] mt-1">
            Try adjusting your filters or add new students to get started
          </p>
        </div>
      ) : (
        <div
          className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {[
                    "Student",
                    "Class",
                    "Academic Year",
                    "DOB",
                    "Guardian",
                    "Contact",
                    "Admitted",
                    "Status",
                    "",
                  ].map(col => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-[11px] font-bold tracking-widest text-[var(--text-3)] uppercase whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {paginatedStudents.map(student => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    onView={handleViewStudent}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAssignClass={handleAssignClass}
                    onStatusToggle={handleStatusToggle}
                    togglingStatus={togglingStatus}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalStudents}
            itemsPerPage={[5, 10, 15, 20]}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            itemName="students"
          />
        </div>
      )}
    </>
  );
}
