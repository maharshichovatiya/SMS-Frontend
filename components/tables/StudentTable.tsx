"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/forms/StudentForm";
import ClassAssignmentForm from "@/components/forms/ClassAssignmentForm";
import StudentTableSkeleton from "@/components/skeletons/StudentTableSkeleton";
import {
  studentApis,
  Student as ApiStudent,
  RecordStatus,
} from "@/lib/api/Student";
import { showToast } from "@/lib/utils/Toast";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

interface Student {
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
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function formatAdmissionDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function formatPhone(phone: string | undefined | null) {
  if (!phone) return "N/A";
  return `${phone.slice(0, 5)}  ${phone.slice(5)}`;
}

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];
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
    classId?: string;
    sectionId?: string;
    gender?: string;
    academicYearId?: string;
    fromDate?: string;
    toDate?: string;
    fromFamilyIncome?: number;
    toFamilyIncome?: number;
  };
  onTotalCountChange?: (count: number) => void;
}) {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);

  const [assigningClassStudent, setAssigningClassStudent] =
    useState<Student | null>(null);

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
              rollNo: apiStudent.rollNo,
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
            };
          });

        setStudents(transformedStudents);
        setTotalStudents(response.data.meta.total);
        onTotalCountChange?.(response.data.meta.total);
      } else {
        setError("Error");
      }
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch students";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchParams?.search ?? null,
    searchParams?.status ?? null,
    searchParams?.classId ?? null,
    searchParams?.sectionId ?? null,
    searchParams?.gender ?? null,
    searchParams?.academicYearId ?? null,
    searchParams?.fromDate ?? null,
    searchParams?.toDate ?? null,
    searchParams?.fromFamilyIncome ?? null,
    searchParams?.toFamilyIncome ?? null,
    onTotalCountChange,
  ]);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, fetchStudents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams?.status ?? null,
    searchParams?.classId ?? null,
    searchParams?.sectionId ?? null,
    searchParams?.gender ?? null,
    searchParams?.academicYearId ?? null,
    searchParams?.fromDate ?? null,
    searchParams?.toDate ?? null,
    searchParams?.fromFamilyIncome ?? null,
    searchParams?.toFamilyIncome ?? null,
    pageSize,
  ]);

  const totalPages = Math.ceil(totalStudents / pageSize);
  const paginatedStudents = students;

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
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
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
      setDeletingStudent(null);
      showToast.apiSuccess("Deleted successfully");
    } catch (error) {
      const errorObj = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorObj.response?.data?.message ||
        errorObj.message ||
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

      // Update local state
      setStudents(prev =>
        prev.map(s =>
          s.id === student.id
            ? { ...s, status: newStatus === "active" ? "Active" : "Inactive" }
            : s,
        ),
      );

      showToast.apiSuccess(
        `Student status updated to ${newStatus === "active" ? "Active" : "Inactive"}`,
      );
    } catch (error) {
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
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student"
        description="Update the student's information below."
      >
        <div className="w-[560px]">
          {editingStudent && (
            <StudentForm
              initialData={{
                id: editingStudent.id,
                firstName: editingStudent.firstName,
                middleName: editingStudent.middleName || "",
                lastName: editingStudent.lastName,
                email: editingStudent.email,
                phone: editingStudent.phone || "",
                rollNo: editingStudent.rollNo,
                admissionDate: editingStudent.admissionDate,
                dob:
                  editingStudent.dob === "N/A" || editingStudent.dob === null
                    ? ""
                    : editingStudent.dob,
                gender:
                  (editingStudent.gender as "male" | "female" | "other" | "") ||
                  "",
                fatherName: editingStudent.fatherName,
                fatherPhone: editingStudent.fatherPhone,
                motherName: editingStudent.motherName,
                guardianName: editingStudent.guardianName,
                familyAnnualIncome: editingStudent.familyAnnualIncome,
                medicalConditions: editingStudent.medicalConditions,
                isAssigned: editingStudent.class !== "Unassigned",
                classId: editingStudent.classId,
                academicYearId: editingStudent.academicYearId,
                className: editingStudent.class,
              }}
              onSubmitSuccess={handleEditSuccess}
              onClose={() => setEditingStudent(null)}
              roleId={roleId}
            />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Delete Student"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeletingStudent(null)}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </>
        }
      >
        <div className="w-[380px] flex flex-col items-center text-center py-2">
          <p className="text-sm text-[var(--text-3)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--text)]">
              {deletingStudent?.firstName} {deletingStudent?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={!!assigningClassStudent}
        onClose={() => setAssigningClassStudent(null)}
        title="Assign Class"
        description="Select a class and academic year for this student."
      >
        <div className="w-[500px]">
          {assigningClassStudent && (
            <div className="mb-4 p-3 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--text)]">
                {assigningClassStudent.firstName}{" "}
                {assigningClassStudent.lastName}
              </p>
            </div>
          )}
          {assigningClassStudent && (
            <ClassAssignmentForm
              studentId={assigningClassStudent.id}
              currentClassId={assigningClassStudent.classId}
              currentAcademicYearId={assigningClassStudent.academicYearId}
              onSubmitSuccess={handleClassAssignmentSuccess}
              onCancel={() => setAssigningClassStudent(null)}
            />
          )}
        </div>
      </Modal>

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
                {paginatedStudents.map(student => {
                  const fullName = `${student.firstName} ${student.lastName}`;
                  const initials = getInitials(
                    student.firstName,
                    student.lastName,
                  );

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--duration-fast)]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-inverse)] text-sm font-bold flex-shrink-0 bg-[var(--blue)] cursor-pointer">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[var(--text)] whitespace-nowrap">
                              {fullName}
                            </p>
                            <p className="text-xs text-[var(--text-3)]">
                              Roll No: {student.rollNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              student.class === "Unassigned"
                                ? "bg-[var(--amber-light)] text-[var(--amber)]"
                                : "bg-[var(--blue-light)] text-[var(--blue)]"
                            }`}
                          >
                            {student.class}
                          </span>
                          {student.class === "Unassigned" && (
                            <button
                              onClick={() => handleAssignClass(student)}
                              className="w-6 cursor-pointer h-6 rounded-full bg-[var(--blue)] text-white hover:bg-[var(--blue-dark)] flex items-center justify-center transition-colors duration-[var(--duration)]"
                              title="Assign Class"
                            >
                              <Users size={11} />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                        {student.academicYear || "N/A"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                        {student.dob}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                        {student.guardian}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                        {formatPhone(student.phone)}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                        {formatAdmissionDate(student.admissionDate)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ToggleSwitch
                            isOn={student.status === "Active"}
                            onToggle={() => handleStatusToggle(student)}
                            disabled={togglingStatus === student.id}
                          />
                          <span
                            className={`
                              px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                              ${
                                student.status === "Active"
                                  ? "bg-[var(--green-light)] text-[var(--green)]"
                                  : "bg-[var(--rose-light)] text-[var(--rose)]"
                              }
                            `}
                          >
                            {student.status}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
                            title="Edit"
                          >
                            <Pencil size={14} strokeWidth={1.8} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)]"
                            title="Delete"
                          >
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-4">
              <p className="text-sm text-[var(--text-3)]">
                Showing{" "}
                {students.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–
                {students.length > 0
                  ? Math.min(currentPage * pageSize, totalStudents)
                  : 0}{" "}
                of {totalStudents.toLocaleString()} students
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--text-3)]">
                  Rows per page:
                </label>
                <select
                  value={pageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-1 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--blue)] rounded-[var(--radius-sm)] hover:bg-[var(--blue-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
