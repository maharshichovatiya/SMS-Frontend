"use client";

import PageHeader from "@/components/layout/PageHeader";
import { Building } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/Index";
import {
  clearError,
  fetchTeacherDashboardData,
  Student,
} from "@/lib/store/TeacherDashboardSlice";
import { showToast } from "@/lib/utils/Toast";
import StudentsTable from "@/components/tables/StudentTable";

export default function MyClass() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.teacherDashboard,
  );

  useEffect(() => {
    dispatch(fetchTeacherDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) {
    return null;
  }

  const classTeacherClass = data?.classTeacher?.class;
  const students = classTeacherClass?.students || [];

  return (
    <div>
      <PageHeader
        title="My Class"
        description="Manage your class students efficiently"
        icon={Building}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      {!classTeacherClass ? (
        <div className="bg-[var(--surface)] mt-5 border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
          <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-[var(--blue)]" />
          </div>
          <h3 className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px] mb-3">
            No Class Assigned
          </h3>
          <p className="text-[var(--text-2)] max-w-md mx-auto">
            You haven&apos;t been assigned as a class teacher yet. Contact your
            administrator for class assignments.
          </p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] mt-5 border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <div className="text-[17px] font-bold text-[var(--text)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                  <Building className="w-5 h-5 text-[var(--blue)]" />
                </div>
                Class {classTeacherClass.className}
                <div className="text-sm text-[var(--text-2)] mt-[2px]">
                  (Total Students: {students.length})
                </div>
              </div>
            </div>
          </div>

          <div className="p-[18px]">
            {students.length > 0 ? (
              <StudentsTable
                students={students.map((student: Student) => ({
                  id: student.id,
                  firstName: student.firstName || "",
                  lastName: student.lastName || "",
                  middleName: student.middleName || "",
                  email: student.email || "",
                  phone: student.phone || "",
                  rollNo: student.rollNo || student.admissionNo,
                  admissionDate: student.admissionDate || "",
                  class: classTeacherClass.className,
                  dob: student.dob || null,
                  gender: student.gender || null,
                  guardian: student.guardianName || "",
                  status: student.status === "active" ? "Active" : "Inactive",
                  fatherName: student.fatherName || "",
                  motherName: student.motherName || "",
                  guardianName: student.guardianName || "",
                  familyAnnualIncome: student.familyAnnualIncome || "",
                  medicalConditions: student.medicalConditions || "",
                  bloodGroup: student.bloodGroup || "",
                  aadhaarNo: student.aadhaarNo || "",
                  panNo: student.panNo || "",
                  permanentAddress: student.permanentAddress || "",
                  currentAddress: student.currentAddress || "",
                  bankName: student.bankName || "",
                  accountNo: student.accountNo || "",
                  ifscCode: student.ifscCode || "",
                  branch: student.branch || "",
                  fatherPhone: student.fatherPhone || "",
                  academicYear:
                    student.academics?.[0]?.academicYear?.yearName || "",
                  academicStartDate:
                    student.academics?.[0]?.academicYear?.startDate || "",
                  academicEndDate:
                    student.academics?.[0]?.academicYear?.endDate || "",
                  academicStatus: student.academics?.[0]?.status || "",
                  promotionStatus:
                    student.academics?.[0]?.promotionStatus || "",
                  percentage: student.academics?.[0]?.percentage || "",
                  remarks: student.academics?.[0]?.remarks || "",
                  section: student.academics?.[0]?.class?.section || "",
                }))}
                totalStudents={students.length}
                loading={false}
                currentPage={1}
                pageSize={10}
                setCurrentPage={() => {}}
                setPageSize={() => {}}
                roleId=""
                onRefresh={() => {}}
                simpleActions={true}
              />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-[var(--text-3)]" />
                </div>
                <h4 className="text-lg font-semibold text-[var(--text)] mb-2">
                  No Students Found
                </h4>
                <p className="text-[var(--text-2)]">
                  No students are assigned to this class yet.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
