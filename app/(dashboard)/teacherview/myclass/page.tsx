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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--blue-light)] border-t-[var(--blue)] mx-auto mb-4"></div>
            <div
              className="absolute inset-0 rounded-full h-12 w-12 border-4 border-transparent border-t-[var(--indigo)] animate-spin mx-auto mb-4 opacity-50"
              style={{ animationDelay: "0.15s" }}
            ></div>
          </div>
          <p className="text-[var(--text-2)] font-medium">
            Loading your classes...
          </p>
          <p className="text-[var(--text-3)] text-sm mt-1">
            Preparing your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="My Classes"
        description="Manage your classes and students efficiently"
        icon={Building}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      {!data || !data.classes || data.classes.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
          <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="w-10 h-10 text-[var(--blue)]" />
          </div>
          <h3 className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px] mb-3">
            No Classes Assigned
          </h3>
          <p className="text-[var(--text-2)] max-w-md mx-auto">
            You haven&apos;t been assigned as a class teacher yet. Contact your
            administrator for class assignments.
          </p>
        </div>
      ) : (
        <div className="space-y-[22px]">
          {data.classes.map(classItem => (
            <div
              key={classItem.classId}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
                <div>
                  <div className="text-[17px] font-bold text-[var(--text)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                      <Building className="w-5 h-5 text-[var(--blue)]" />
                    </div>
                    Class {classItem.className}-{classItem.section}
                    <div className="text-sm text-[var(--text-2)] mt-[2px]">
                      (Total Students: {classItem.studentCount})
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-[18px]">
                <div className="text-[12px] font-bold text-[var(--text-3)] uppercase tracking-[0.5px] mb-4">
                  Students
                </div>
                <StudentsTable
                  students={
                    classItem.students?.map((student: Student) => ({
                      id: student.id,
                      firstName: student.firstName || "",
                      lastName: student.lastName || "",
                      middleName: student.middleName || "",
                      email: student.email || "",
                      phone: student.phone || "",
                      rollNo: student.rollNo || student.admissionNo,
                      admissionDate: student.admissionDate || "",
                      class: classItem.className,
                      dob: student.dob || null,
                      gender: student.gender || null,
                      guardian: student.guardianName || "",
                      status:
                        student.status === "active" ? "Active" : "Inactive",
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
                      section: classItem.section || "",
                    })) || []
                  }
                  totalStudents={classItem.students?.length || 0}
                  loading={false}
                  currentPage={1}
                  pageSize={10}
                  setCurrentPage={() => { }}
                  setPageSize={() => { }}
                  roleId=""
                  onRefresh={() => { }}
                  simpleActions={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
