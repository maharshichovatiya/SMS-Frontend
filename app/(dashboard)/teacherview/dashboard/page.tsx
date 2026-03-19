"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Building, BookOpen, Users, Award } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/Index";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Building, BookOpen, Users, Award } from "lucide-react";
import { RootState, AppDispatch } from "@/lib/store/Index";
import { useTeacherProfile } from "@/lib/hooks/UseTeacherProfile";
import {
  fetchTeacherDashboardData,
  clearError,
} from "@/lib/store/TeacherDashboardSlice";
import { fetchAssignClassData } from "@/lib/store/AssignClassSlice";
import {
  fetchAssignSubjectData,
  Subject,
  SubjectClass,
} from "@/lib/store/AssignSubjectSlice";
import { showToast } from "@/lib/utils/Toast";
import CommonTeacherHeader from "@/components/layout/CommonTeacherHeader";
import {
  fetchTeacherDashboardData,
  clearError,
} from "@/lib/store/TeacherDashboardSlice";
import { fetchAssignClassData } from "@/lib/store/AssignClassSlice";
import {
  fetchAssignSubjectData,
  Subject,
  SubjectClass,
} from "@/lib/store/AssignSubjectSlice";
import { showToast } from "@/lib/utils/Toast";
import PageHeader from "@/components/layout/PageHeader";

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

interface SubjectWithClass extends Subject {
  className: string;
  section: string;
  classId: string;
  classSection: string;
}

const TeacherDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userRole =
    useSelector((state: RootState) => state.auth.role) || "teacher";
  const { teacherData, loading, error, userId } = useTeacherProfile();
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useSelector((state: RootState) => state.teacherDashboard);
  const { data: assignClassData } = useSelector(
    (state: RootState) => state.assignClass,
  );
  const { data: assignSubjectData } = useSelector(
    (state: RootState) => state.assignSubject,
  );

  useEffect(() => {
    dispatch(fetchTeacherDashboardData());
    dispatch(fetchAssignClassData());
    dispatch(fetchAssignSubjectData());
  }, [dispatch]);

  useEffect(() => {
    if (dashboardError) {
      showToast.error(dashboardError);
      dispatch(clearError());
    }
  }, [dashboardError, dispatch]);

  const stats = {
    totalAssignedClasses: assignClassData?.summary?.totalClasses || 0,
    totalAssignedSubjects: assignSubjectData?.totalSubjects || 0,
    totalAssignedStudents: dashboardData?.totalStudents || 0,
    totalClassTeacherClasses: dashboardData?.summary?.totalClasses || 0,
    homeworkAssigned: 12,
    avgAttendance: 95,
    yearsOfExperience: teacherData?.totalExpMonths
      ? Math.floor(teacherData.totalExpMonths / 12)
      : 0,
    resourcesUploaded: 8,
  };

  if (dashboardLoading) {
    return null;
  }

  if (!userId) {
    return null;
  }

  if (loading && !teacherData) {
    return null;
  }

  if (error && !teacherData) {
    return null;
  }

  if (!teacherData) {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="Teacher Dashboard"
        description="Overview of your classes, subjects, and students"
        icon={Award}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-[22px]">
        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#9aa5c4] font-medium uppercase tracking-wider">
                Total Assigned Classes
              </p>
              <p className="text-2xl font-bold text-[#111827] mt-1">
                {stats.totalAssignedClasses}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#eef1ff] rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-[#3d6cf4]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#9aa5c4] font-medium uppercase tracking-wider">
                Total Assigned Subjects
              </p>
              <p className="text-2xl font-bold text-[#111827] mt-1">
                {stats.totalAssignedSubjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#e6faf5] rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#12a47e]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#9aa5c4] font-medium uppercase tracking-wider">
                Total Assigned Students
              </p>
              <p className="text-2xl font-bold text-[#111827] mt-1">
                {stats.totalAssignedStudents}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#fff0f4] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-[#e83b6a]" />
            </div>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-[#9aa5c4] font-medium uppercase tracking-wider">
                Class Teacher Classes
              </p>
              <p className="text-2xl font-bold text-[#111827] mt-1">
                {stats.totalClassTeacherClasses}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#f0f9ff] rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-[#0ea5c9]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-[18px]">
        <SectionCard
          title="Assigned Subjects"
          subtitle={`${stats.totalAssignedSubjects} subjects assigned to you`}
          delay={0.05}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="border-b border-[#dde3f5] bg-[#fafbff]">
                  <th className="px-3 py-2 text-left text-xs font-bold tracking-wider text-[#5c6a8a] uppercase whitespace-nowrap">
                    Subject Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold tracking-wider text-[#5c6a8a] uppercase whitespace-nowrap">
                    Subject Code
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-bold tracking-wider text-[#5c6a8a] uppercase whitespace-nowrap">
                    Class
                  </th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const allSubjects =
                    assignSubjectData?.subjectsByClass?.flatMap(
                      (classData: SubjectClass) =>
                        classData.subjects?.map((subject: Subject) => ({
                          ...subject,
                          className: classData.className,
                          section: classData.section,
                          classId: classData.classId,
                          classSection: `${classData.className}-${classData.section}`,
                        })),
                    ) || [];

                  return allSubjects.length > 0 ? (
                    allSubjects.map((item: SubjectWithClass) => (
                      <tr
                        key={`${item.classId}-${item.subjectId}`}
                        className="border-b border-[#dde3f5] hover:bg-[#f8faff] transition-colors duration-150"
                      >
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-[#eef1ff] rounded flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-3 h-3 text-[#3d6cf4]" />
                            </div>
                            <span className="font-medium text-[#111827] text-sm">
                              {item.subjectName}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#f0f9ff] text-[#0ea5c9] border border-[#0ea5c9]/20">
                            {item.subjectCode}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-[#eef1ff] text-[#3d6cf4] border border-[#3d6cf4]/20">
                            {item.classSection}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-3 py-8 text-center text-sm text-[#9aa5c4]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 bg-[#fafbff] rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-[#9aa5c4]" />
                          </div>
                          <span className="text-sm">
                            No subjects assigned yet
                          </span>
                          <div className="text-xs text-[#9aa5c4]">
                            Debug:{" "}
                            {JSON.stringify(
                              assignSubjectData?.subjectsByClass || "No data",
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="Assigned Classes"
          subtitle={`${stats.totalAssignedClasses} classes assigned to you`}
          delay={0.08}
        >
          <div className="space-y-2">
            {assignClassData?.classes?.map(
              (classItem: {
                classId: string;
                className: string;
                section: string;
                studentCount: number;
                subjects?: {
                  subjectId: string;
                  subjectName: string;
                  subjectCode: string;
                  passingMarks?: number;
                  maxMarks?: number;
                }[];
              }) => (
                <div
                  key={classItem.classId}
                  className="flex items-center gap-3 p-3 bg-[#fafbff] rounded-xl border border-[#dde3f5] transition-all duration-200 hover:bg-[#f0f4ff] hover:border-[#3d6cf4]"
                >
                  <div className="w-10 h-10 bg-[#eef1ff] rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#3d6cf4]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[14px] text-[#111827]">
                      Class {classItem.className}-{classItem.section}
                    </div>
                    <div className="text-[11px] text-[#5c6a8a]">
                      {classItem.studentCount} students
                    </div>
                  </div>
                  <div className="text-[11px] text-[#3d6cf4] font-medium">
                    {classItem.subjects?.length || 0} subjects
                  </div>
                </div>
              ),
            ) || (
              <div className="text-center text-[13px] text-[#9aa5c4] py-4">
                No classes assigned yet
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Class Teacher Classes"
          subtitle={`${stats.totalClassTeacherClasses} classes where you are class teacher`}
          delay={0.11}
        >
          <div className="space-y-2">
            {dashboardData?.classes?.map(
              (classItem: {
                classId: string;
                className: string;
                section: string;
                studentCount: number;
              }) => (
                <div
                  key={classItem.classId}
                  className="flex items-center gap-3 p-3 bg-[#e6faf5] rounded-xl border border-[#12a47e]/20 transition-all duration-200 hover:bg-[#d4f4ec] hover:border-[#12a47e]"
                >
                  <div className="w-10 h-10 bg-[#12a47e] rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[14px] text-[#111827]">
                      Class {classItem.className}-{classItem.section}
                    </div>
                    <div className="text-[11px] text-[#5c6a8a]">
                      {classItem.studentCount} students
                    </div>
                  </div>
                  <div className="text-[11px] text-[#12a47e] font-medium">
                    Class Teacher
                  </div>
                </div>
              ),
            ) || (
              <div className="text-center text-[13px] text-[#9aa5c4] py-4">
                No class teacher assignments yet
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TeacherDashboard;
