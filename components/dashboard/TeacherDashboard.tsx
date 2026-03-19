"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Building, BookOpen, Users, Award } from "lucide-react";
import { useRouter } from "next/navigation";
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
import StatCard from "@/components/ui/StatCard";
import { ProfileData } from "@/lib/types/Profile";

interface QuickItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  sub: string;
  onClick?: () => void;
}

function QuickItem({
  icon,
  iconBg,
  iconColor,
  label,
  sub,
  onClick,
}: QuickItemProps) {
  return (
    <div
      className="flex items-center gap-3 px-[18px] py-[13px] border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-[var(--surface-2)] transition-colors duration-[120ms]"
      onClick={onClick}
    >
      <div
        className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconBg}`}
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold">{label}</div>
        <div className="text-[12.5px] text-[var(--text-2)]">{sub}</div>
      </div>
      <div className="ml-auto text-[var(--text-3)] text-[18px]">›</div>
    </div>
  );
}

interface SubjectWithClass extends Subject {
  className: string;
  section: string;
  classId: string;
  classSection: string;
}

interface ClassItem {
  classId: string;
  className: string;
  section: string;
  studentCount: number;
  subjects?: Subject[];
}

interface TeacherDashboardProps {
  profile: ProfileData | null;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ profile }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
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

  const stats = useMemo(
    () => ({
      totalAssignedClasses: assignClassData?.summary?.totalClasses || 0,
      totalAssignedSubjects: assignSubjectData?.totalSubjects || 0,
      totalAssignedStudents: dashboardData?.totalStudents || 0,
      totalClassTeacherClasses: dashboardData?.summary?.totalClasses || 0,
      yearsOfExperience: teacherData?.totalExpMonths
        ? Math.floor(teacherData.totalExpMonths / 12)
        : 0,
    }),
    [
      assignClassData?.summary?.totalClasses,
      assignSubjectData?.totalSubjects,
      dashboardData?.totalStudents,
      dashboardData?.summary?.totalClasses,
      teacherData?.totalExpMonths,
    ],
  );

  const allSubjects = useMemo(() => {
    return (
      assignSubjectData?.subjectsByClass?.flatMap(
        (classData: SubjectClass) =>
          classData.subjects?.map((subject: Subject) => ({
            ...subject,
            className: classData.className,
            section: classData.section,
            classId: classData.classId,
            classSection: `${classData.className}-${classData.section}`,
          })) || [],
      ) || []
    );
  }, [assignSubjectData?.subjectsByClass]);

  const getStatValue = useCallback(
    (value: number | undefined) => {
      if (dashboardLoading) return "...";
      return value?.toString() || "0";
    },
    [dashboardLoading],
  );

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
    <>
      <div className="flex items-center justify-between mb-7 flex-wrap gap-[14px]">
        <div>
          <div className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px]">
            {getGreeting()},{" "}
            {profile?.firstName || teacherData?.user?.firstName || "Teacher"} 👋
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-[22px] max-xl:grid-cols-2">
        <StatCard
          icon={<Building className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--blue-light)]"
          iconColor="var(--blue)"
          glowColor="var(--blue)"
          label="Assigned Classes"
          value={getStatValue(stats.totalAssignedClasses)}
          trend={`${stats.totalAssignedClasses} classes`}
          trendUp
        />
        <StatCard
          icon={<BookOpen className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--green-light)]"
          iconColor="var(--green)"
          glowColor="var(--green)"
          label="Assigned Subjects"
          value={getStatValue(stats.totalAssignedSubjects)}
          trend={`${stats.totalAssignedSubjects} subjects`}
          trendUp
        />
        <StatCard
          icon={<Users className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--cyan-light)]"
          iconColor="var(--cyan)"
          glowColor="var(--cyan)"
          label="Total Students"
          value={getStatValue(stats.totalAssignedStudents)}
          trend={`${stats.totalAssignedStudents} students`}
          trendUp
        />
        <StatCard
          icon={<Award className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--amber-light)]"
          iconColor="var(--amber)"
          glowColor="var(--amber)"
          label="Class Teacher"
          value={getStatValue(stats.totalClassTeacherClasses)}
          trend={`${stats.totalClassTeacherClasses} classes`}
          trendUp={stats.totalClassTeacherClasses > 0}
        />
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-5 mb-[22px] max-lg:grid-cols-1">
        <div className="space-y-[22px]">
          {/* Assigned Subjects */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <div className="text-[17px] font-bold text-[var(--text)]">
                  Assigned Subjects
                </div>
                <div className="text-sm text-[var(--text-2)] mt-[2px]">
                  Subjects assigned to you
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-[var(--blue-light)] text-[var(--blue)] px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {stats.totalAssignedSubjects}
                </div>
              </div>
            </div>
            <div className="p-[18px]">
              {allSubjects.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                          Subject
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                          Code
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-3)] uppercase tracking-wide">
                          Class
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSubjects.map((item: SubjectWithClass) => (
                        <tr
                          key={`${item.classId}-${item.subjectId}`}
                          className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[var(--blue-light)] rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-[var(--blue)]" />
                              </div>
                              <span className="font-medium text-[var(--text)]">
                                {item.subjectName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[var(--cyan-light)] text-[var(--cyan)]">
                              {item.subjectCode}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-[var(--blue-light)] text-[var(--blue)]">
                              {item.classSection}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-[var(--surface-2)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-[var(--text-3)]" />
                  </div>
                  <p className="text-[var(--text-2)]">
                    No subjects assigned yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Classes */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
              <div>
                <div className="text-[17px] font-bold text-[var(--text)]">
                  Assigned Classes
                </div>
                <div className="text-sm text-[var(--text-2)] mt-[2px]">
                  Classes you teach
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-[var(--blue-light)] text-[var(--blue)] px-2 py-0.5 rounded-md text-[10px] font-bold">
                  {stats.totalAssignedClasses}
                </div>
              </div>
            </div>
            <div className="p-[18px]">
              <div className="space-y-2">
                {assignClassData?.classes &&
                assignClassData.classes.length > 0 ? (
                  assignClassData.classes.map((classItem: ClassItem) => (
                    <div
                      key={classItem.classId}
                      className="flex items-center gap-3 p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] transition-all duration-200 hover:bg-[var(--surface-3)]"
                    >
                      <div className="w-10 h-10 bg-[var(--blue-light)] rounded-lg flex items-center justify-center">
                        <Building className="w-5 h-5 text-[var(--blue)]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[14px] text-[var(--text)]">
                          Class {classItem.className}-{classItem.section}
                        </div>
                        <div className="text-[11px] text-[var(--text-2)]">
                          {classItem.studentCount} students
                        </div>
                      </div>
                      <div className="text-[11px] text-[var(--blue)] font-medium">
                        {classItem.subjects?.length || 0} subjects
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-[13px] text-[var(--text-2)] py-4">
                    No classes assigned yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[18px]">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="text-[15px] font-bold text-[var(--text)]">
                Quick Access
              </div>
            </div>
            <QuickItem
              icon={<BookOpen className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--green-light)]"
              iconColor="var(--green)"
              label="Assign Students"
              sub="Manage student assignments"
              onClick={() => router.push("/teacherview/assign-students")}
            />
            <QuickItem
              icon={<Users className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--blue-light)]"
              iconColor="var(--blue)"
              label="My Classes"
              sub="View your assigned classes"
              onClick={() => router.push("/teacherview/myclass")}
            />
            <QuickItem
              icon={<Building className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--amber-light)]"
              iconColor="var(--amber)"
              label="Homework"
              sub="Manage homework assignments"
              onClick={() => router.push("/teacherview/homework")}
            />
            <QuickItem
              icon={<Award className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--cyan-light)]"
              iconColor="var(--cyan)"
              label="Profile"
              sub={`${stats.yearsOfExperience} years experience`}
              onClick={() => router.push("/profile")}
            />
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <div className="text-[16px] font-bold text-[var(--text)] tracking-tight">
                  Teacher Info
                </div>
                <div className="text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider mt-0.5">
                  Your Profile Details
                </div>
              </div>
              <div className="bg-[var(--blue-light)] text-[var(--blue)] px-2 py-0.5 rounded-md text-[10px] font-bold">
                Active
              </div>
            </div>
            <div className="px-[22px] py-[15px] border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--blue)] to-[var(--indigo)] rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                  {teacherData?.user?.firstName?.charAt(0)}
                  {teacherData?.user?.lastName?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="text-[14px] text-[var(--text)] font-bold">
                    {teacherData?.user?.firstName} {teacherData?.user?.lastName}
                  </div>
                  <div className="text-[11px] text-[var(--text-2)]">
                    {teacherData?.designation || "Teacher"}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-[22px] py-[15px] space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-2)]">Employee ID</span>
                <span className="text-[var(--text)] font-medium">
                  {teacherData?.employeeCode || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-2)]">Experience</span>
                <span className="text-[var(--text)] font-medium">
                  {stats.yearsOfExperience} years
                </span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-[var(--text-2)]">Specialization</span>
                <span className="text-[var(--text)] font-medium">
                  {teacherData?.specialization || "General"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
