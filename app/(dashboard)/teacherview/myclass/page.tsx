"use client";

import { useEffect, useState } from "react";
import { Building } from "lucide-react";
import {
  fetchClassTeacherData,
  ClassTeacherData,
} from "@/lib/api/ClassTeacher";
import { showToast } from "@/lib/utils/Toast";
import CommonTeacherHeader from "@/components/layout/CommonTeacherHeader";
import StudentsTable from "@/components/tables/StudentTable";

export default function MyClass() {
  const [classTeacherData, setClassTeacherData] =
    useState<ClassTeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStatus, setCurrentStatus] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchClassTeacherData();
        setClassTeacherData(data);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch class data";
        setError(errorMessage);
        showToast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <CommonTeacherHeader
      title="My Classes"
      subtitle="Manage your classes and students efficiently"
      searchPlaceholder="Search students by name, email, or roll number..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      useApiData={false}
      userRole="teacher"
      showStatusFilters={true}
      currentStatus={currentStatus}
      onStatusChange={setCurrentStatus}
    >
      {!classTeacherData?.class ? (
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
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <div className="text-[17px] font-bold text-[var(--text)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--blue-light)] flex items-center justify-center">
                    <Building className="w-5 h-5 text-[var(--blue)]" />
                  </div>
                  Class {classTeacherData.class.className}
                  <div className="text-sm text-[var(--text-2)] mt-[2px]">
                    (Total Students:{" "}
                    {classTeacherData.class.students?.length || 0})
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
                  classTeacherData.class.students?.map(student => ({
                    id: student.id,
                    firstName: student.name.split(" ")[0] || student.name,
                    lastName: student.name.split(" ").slice(1).join(" ") || "",
                    middleName: null,
                    email: "",
                    phone: "",
                    rollNo: student.id,
                    admissionDate: "",
                    class: classTeacherData.class.className,
                    dob: null,
                    gender: null,
                    guardian: "",
                    status: student.status === "active" ? "Active" : "Inactive",
                    fatherName: "",
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
                    fatherPhone: "",
                  })) || []
                }
                totalStudents={classTeacherData.class.students?.length || 0}
                loading={false}
                currentPage={1}
                pageSize={10}
                setCurrentPage={() => {}}
                setPageSize={() => {}}
                roleId=""
                onRefresh={() => {}}
                simpleActions={true}
              />
            </div>
          </div>
        </div>
      )}
    </CommonTeacherHeader>
  );
}
