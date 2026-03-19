"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Building, ArrowLeft } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { AppDispatch, RootState } from "@/lib/store/Index";
import {
  clearError,
  fetchTeacherDashboardData,
  Student,
  TeacherClass,
} from "@/lib/store/TeacherDashboardSlice";
import { showToast } from "@/lib/utils/Toast";
import StudentsTable from "@/components/tables/StudentTable";

export default function AssignStudentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.teacherDashboard,
  );
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);

  useEffect(() => {
    dispatch(fetchTeacherDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      showToast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  const handleClassClick = (classItem: TeacherClass) => {
    setSelectedClass(classItem);
  };

  if (loading) {
    return null;
  }

  const classes = data?.classes || [];

  const renderClasses = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
      {classes.map((classItem: TeacherClass, index: number) => (
        <div
          key={classItem.id}
          onClick={() => handleClassClick(classItem)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-5 cursor-pointer hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="font-bold text-[var(--text)] text-lg">
                Class {classItem.className}
              </div>
              <div className="text-sm text-[var(--text-2)] mt-1">
                {classItem.students?.length || 0} students
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStudents = () => {
    if (!selectedClass) return null;

    return (
      <div className="mt-5">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <div className="text-[17px] font-bold text-[var(--text)] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                  <Building className="w-5 h-5 text-[var(--blue)]" />
                </div>
                Class {selectedClass.className}
                <div className="text-sm text-[var(--text-2)] mt-[2px]">
                  (Total Students: {selectedClass.students?.length || 0})
                </div>
              </div>
            </div>
          </div>

          <div className="p-[18px]">
            {selectedClass.students && selectedClass.students.length > 0 ? (
              <StudentsTable
                students={selectedClass.students.map((student: Student) => ({
                  id: student.id,
                  firstName: student.firstName || "",
                  lastName: student.lastName || "",
                  middleName: student.middleName || "",
                  email: student.email || "",
                  phone: student.phone || "",
                  rollNo: student.rollNo || student.admissionNo,
                  admissionDate: student.admissionDate || "",
                  class: selectedClass.className,
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
                totalStudents={selectedClass.students.length}
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
                  <Users className="w-8 h-8 text-[var(--text-3)]" />
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
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Assign Students"
        description={
          selectedClass
            ? `Students in Class ${selectedClass.className}`
            : "Select a class to view students"
        }
        icon={Users}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      {selectedClass && (
        <button
          onClick={handleBackToClasses}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold cursor-pointer border border-gray-200 bg-white text-gray-500 transition-all duration-150 mb-4 mt-4 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Classes
        </button>
      )}

      <div className="flex items-center gap-2 text-sm text-[var(--text-2)] mt-4">
        <span
          className={`cursor-pointer ${!selectedClass ? "text-[var(--blue)] font-semibold" : "hover:text-[var(--blue)]"}`}
          onClick={handleBackToClasses}
        >
          Classes
        </span>
        {selectedClass && (
          <>
            <span>/</span>
            <span className="text-[var(--blue)] font-semibold">
              Class {selectedClass.className}
            </span>
          </>
        )}
      </div>

      {classes.length === 0 ? (
        <div className="bg-[var(--surface)] mt-5 border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
          <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[var(--blue)]" />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text)] mb-3">
            No Classes Assigned
          </h3>
          <p className="text-[var(--text-2)] max-w-md mx-auto">
            You haven&apos;t been assigned to any classes yet. Contact your
            administrator for class assignments.
          </p>
        </div>
      ) : selectedClass ? (
        renderStudents()
      ) : (
        renderClasses()
      )}
    </div>
  );
}
