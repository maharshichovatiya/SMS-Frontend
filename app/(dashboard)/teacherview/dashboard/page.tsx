"use client";

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/Index";
import { useTeacherProfile } from "@/lib/hooks/UseTeacherProfile";
import ProfileStats from "@/components/teacherProfile/ProfileStats";
import AssignedClassCard from "@/components/teacherProfile/AssignedClassCard";

const SectionCard: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, subtitle, children, delay = 0 }) => (
  <div
    className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden mb-[18px] animate-fadeUp"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="px-[22px] py-4 border-b border-[#dde3f5] bg-[#fafbff] flex items-center justify-between flex-wrap gap-2">
      <div>
        <div className="text-[15px] font-bold text-[#111827] font-[var(--font-sans)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12px] text-[#9aa5c4] mt-[2px] font-[var(--font-sans)]">
            {subtitle}
          </div>
        )}
      </div>
    </div>
    <div className="px-[22px] py-5">{children}</div>
  </div>
);

const TeacherDashboard: React.FC = () => {
  const userRole =
    useSelector((state: RootState) => state.auth.role) || "teacher";
  const { teacherData, loading, error, userId } = useTeacherProfile();

  const mockAssignedClasses = useMemo(
    () => [
      {
        id: "1",
        code: "10-A-MATH",
        grade: "10",
        subject: "Mathematics",
        students: 32,
        isClassTeacher: true,
        room: "Room 201",
        schedule: {
          day: "Monday",
          startTime: "09:00",
          endTime: "10:00",
          period: 1,
        },
      },
      {
        id: "2",
        code: "9-B-MATH",
        grade: "9",
        subject: "Mathematics",
        students: 28,
        isClassTeacher: false,
        room: "Room 205",
        schedule: {
          day: "Tuesday",
          startTime: "10:30",
          endTime: "11:30",
          period: 2,
        },
      },
    ],
    [],
  );

  const assignedSubjects = useMemo(() => {
    const subjects = new Set(mockAssignedClasses.map(cls => cls.subject));
    return Array.from(subjects);
  }, [mockAssignedClasses]);

  const stats = {
    totalStudents: mockAssignedClasses.reduce(
      (sum, cls) => sum + cls.students,
      0,
    ),
    classesAssigned: mockAssignedClasses.length,
    homeworkAssigned: 12,
    avgAttendance: 95,
    yearsOfExperience: teacherData?.totalExpMonths
      ? Math.floor(teacherData.totalExpMonths / 12)
      : 0,
    resourcesUploaded: 8,
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">
          User not authenticated. Please login again.
        </div>
      </div>
    );
  }

  if (loading && !teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading teacher profile...</div>
      </div>
    );
  }

  if (error && !teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No teacher data available</div>
      </div>
    );
  }

  if (error && !teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">No teacher data available</div>
      </div>
    );
  }

  return (
    <div className="font-[var(--font-sans)] min-h-screen bg-[var(--color-bg)] p-0">
      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp">
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(90deg, #3d6cf4, #6c47f5)`,
          }}
        />

        <div className="px-7 py-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-[18px]">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-extrabold text-white font-[var(--font-sans)] flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, #3d6cf4, #6c47f5)`,
                  boxShadow: `0 6px 20px #3d6cf450`,
                }}
              >
                {`${teacherData?.user?.firstName?.charAt(0) || ""}${teacherData?.user?.lastName?.charAt(0) || ""}`.toUpperCase()}
              </div>

              <div
                className={`absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-[2.5px] border-white ${
                  teacherData?.status === "active"
                    ? "bg-[#12a47e]"
                    : "bg-[#e83b6a]"
                }`}
              />
            </div>

            <div>
              <div className="text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
                {teacherData?.user?.firstName} {teacherData?.user?.lastName}
              </div>
              <div className="text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
                {teacherData?.designation} · {teacherData?.department} Dept.
              </div>
              <div className="flex items-center flex-wrap gap-2 mt-2">
                <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] font-mono">
                  {teacherData?.employeeCode}
                </span>

                <span
                  className={`text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full font-[var(--font-sans)] ${
                    teacherData?.status === "active"
                      ? "bg-[#e6faf5] text-[#12a47e]"
                      : "bg-[#fff0f4] text-[#e83b6a]"
                  }`}
                >
                  {teacherData?.status}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 items-center">
            <span className="px-[14px] py-1.5 rounded-full bg-[#eef1ff] text-[#3d6cf4] text-[12px] font-bold capitalize border-[1.5px] border-[#3d6cf4]">
              {userRole} View
            </span>
          </div>
        </div>
      </div>

      <ProfileStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[18px]">
        <SectionCard
          title="Assigned Classes"
          subtitle={`${mockAssignedClasses.length} classes · ${stats.totalStudents} total students`}
          delay={0.05}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px] classes-grid">
            {mockAssignedClasses.map(cls => (
              <AssignedClassCard key={cls.id} cls={cls} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Assigned Subjects"
          subtitle={`${assignedSubjects.length} subjects`}
          delay={0.08}
        >
          <div className="flex flex-col gap-2">
            {assignedSubjects.map(subject => (
              <div
                key={subject}
                className="flex items-center gap-[10px] px-4 py-3 bg-[#fafbff] rounded-xl border border-[#dde3f5] transition-all duration-200 hover:bg-[#f0f4ff] hover:border-[#3d6cf4]"
              >
                <div className="text-[14px] font-semibold text-[#111827] font-[var(--font-sans)]">
                  {subject}
                </div>
                <div className="ml-auto text-[12px] text-[#5c6a8a] font-[var(--font-sans)]">
                  {
                    mockAssignedClasses.filter(cls => cls.subject === subject)
                      .length
                  }{" "}
                  class
                  {mockAssignedClasses.filter(cls => cls.subject === subject)
                    .length > 1
                    ? "es"
                    : ""}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1200px) {
          .grid-cols-\[2fr_1fr\] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .classes-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .classes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherDashboard;
