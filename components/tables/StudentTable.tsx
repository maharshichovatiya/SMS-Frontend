"use client";

import { useState } from "react";
import StudentTableSkeleton from "@/components/skeletons/StudentTableSkeleton";
import StudentTableRow from "./StudentTableRow";
import Pagination from "@/components/ui/Pagination";
import { Users } from "lucide-react";
import { showToast } from "@/lib/utils/Toast";
import { studentApis } from "@/lib/api/Student";
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
  rollNo?: string;
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

export default function StudentsTable({
  students,
  totalStudents,
  loading,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
  roleId,
  onRefresh,
  hasActiveFilters,
  searchQuery,
  simpleActions = false,
}: {
  students: Student[];
  totalStudents: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  roleId: string;
  onRefresh?: () => void;
  hasActiveFilters?: boolean;
  searchQuery?: string;
  simpleActions?: boolean;
}) {
  const totalPages = Math.ceil(totalStudents / pageSize);
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
    onRefresh?.();
  };

  const handleDeleteClick = (student: Student) => setDeletingStudent(student);

  const handleAssignClass = (student: Student) =>
    setAssigningClassStudent(student);

  const handleViewStudent = (student: Student) => setViewingStudent(student);

  const handleClassAssignmentSuccess = () => {
    setAssigningClassStudent(null);
    onRefresh?.();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await studentApis.deleteStudent(deletingStudent.id);
      onRefresh?.(); // Use onRefresh instead of fetchStudents
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

      // Use onRefresh to get updated data
      onRefresh?.();

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
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 sm:mt-24 text-[var(--text-2)] px-4 text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-30" />
          <p className="text-base sm:text-lg font-medium">
            {hasActiveFilters || searchQuery
              ? "No results match your search"
              : "No students found"}
          </p>
          <p className="text-xs sm:text-sm">
            {hasActiveFilters || searchQuery
              ? "Try adjusting your search or filters."
              : "Click Admit Student to get started."}
          </p>
        </div>
      ) : (
        <div
          className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden"
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[1100px] border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  {[
                    "Student",
                    "Class",
                    "Academic Year",
                    "DOB",
                    "Guardian",
                    "Contact",
                    simpleActions ? "Email" : "Admitted",
                    "Status",
                    "",
                  ].map(col => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left text-[11px] font-bold tracking-widest text-[var(--text-2)] uppercase whitespace-nowrap opacity-80"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {students.map((student: Student) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    onView={handleViewStudent}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAssignClass={handleAssignClass}
                    onStatusToggle={handleStatusToggle}
                    togglingStatus={togglingStatus}
                    simpleActions={simpleActions}
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
