"use client";

import { Users, BookOpen, Building, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  dashboardApis,
  DashboardSummary,
  RecentAdmission,
  RecentTeacher,
} from "@/lib/api/Dashboard";
import StudentForm from "@/components/forms/StudentForm";
import Modal from "@/components/ui/Modal";
import { authApi, Role } from "@/lib/api/Auth";
import { studentApis, Student } from "@/lib/api/Student";

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  glowColor: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  glowColor,
  label,
  value,
}: StatCardProps) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-5 py-[22px] shadow-[var(--shadow)] relative overflow-hidden transition-all duration-200 ">
      <div
        className="absolute -right-[30px] -top-[30px] w-[100px] h-[100px] rounded-full opacity-[0.08]"
        style={{ background: glowColor }}
      />
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div className="text-[13px] font-bold text-[var(--text-2)] uppercase tracking-[0.5px] mb-2">
        {label}
      </div>
      <div className="text-[38px] font-extrabold tracking-[-1.5px] text-[var(--text)] mb-[8px] leading-none">
        {value}
      </div>
    </div>
  );
}

type BadgeVariant = "blue" | "green" | "amber" | "rose" | "indigo" | "cyan";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

function Badge({ children, variant = "blue" }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    blue: "bg-[var(--blue-light)] text-[var(--blue)]",
    green: "bg-[var(--green-light)] text-[var(--green)]",
    amber: "bg-[var(--amber-light)] text-[var(--amber)]",
    rose: "bg-[var(--rose-light)] text-[var(--rose)]",
    indigo: "bg-[var(--indigo-light)] text-[var(--indigo)]",
    cyan: "bg-[var(--cyan-light)] text-[var(--cyan)]",
  };
  return (
    <span
      className={`inline-flex items-center px-[11px] py-[3px] rounded-full text-[11.5px] font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

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

export default function DashboardContent() {
  const router = useRouter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentAdmissions, setRecentAdmissions] = useState<RecentAdmission[]>(
    [],
  );
  const [recentTeachers, setRecentTeachers] = useState<RecentTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [role, setRole] = useState<string>("");
  const [loadingStudentId, setLoadingStudentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          summaryResponse,
          admissionsResponse,
          teachersResponse,
          rolesResponse,
        ] = await Promise.all([
          dashboardApis.getSummary(),
          dashboardApis.getRecentAdmissions(),
          dashboardApis.getRecentTeachers(),
          authApi.getRoles(),
        ]);

        if (summaryResponse?.data) {
          setSummary(summaryResponse.data);
        }

        if (admissionsResponse?.data) {
          setRecentAdmissions(admissionsResponse.data);
        }

        if (teachersResponse?.data) {
          setRecentTeachers(teachersResponse.data);
        }

        const studentRole = rolesResponse.data?.find(
          (role: Role) => role.roleName.toLowerCase() === "student",
        );
        if (studentRole) {
          setRole(studentRole.id);
        }
      } catch {
        // Handle error silently for now
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatValue = (value: number | undefined) => {
    if (loading) return "...";
    return value?.toString() || "0";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined,
  ) => {
    if (!firstName && !lastName) return "??";
    const f = firstName?.charAt(0) || "";
    const l = lastName?.charAt(0) || "";
    return (f + l).toUpperCase() || "??";
  };

  const getBadgeVariant = (section: string): BadgeVariant => {
    const variants: Record<string, BadgeVariant> = {
      A: "blue",
      B: "indigo",
      C: "amber",
      D: "rose",
      rt: "cyan",
    };
    return variants[section] || "blue";
  };

  const handleEdit = async (student: RecentAdmission) => {
    setLoadingStudentId(student.id);
    try {
      const studentsResponse = await studentApis.getAll();
      const fullStudent = studentsResponse.data?.data.find(
        s => s.id === student.id,
      );

      if (fullStudent) {
        setEditingStudent(fullStudent);
      } else {
        alert(
          "Complete student details not available. Redirecting to Students page for full editing...",
        );
        router.push("/students");
      }
    } catch {
      // Handle error gracefully
      alert(
        "Unable to load student details. Please try again from the Students page.",
      );
      router.push("/students");
    } finally {
      setLoadingStudentId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingStudent(null);
    // Refresh the recent admissions data
    dashboardApis
      .getRecentAdmissions()
      .then(response => {
        if (response?.data) {
          setRecentAdmissions(response.data);
        }
      })
      .catch(() => {
        // Handle error silently
      });
  };

  return (
    <>
      {/* ... */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-[14px]">
        <div>
          {/* ... */}
          <div className="text-[11px] font-bold tracking-[0.8px] uppercase text-[var(--blue)] mb-[3px]">
            Overview
          </div>
          <div className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px]">
            Good morning, Admin 👋
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-4 gap-4 mb-[22px] max-xl:grid-cols-2">
        <StatCard
          icon={<Users className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--blue-light)]"
          iconColor="var(--blue)"
          glowColor="var(--blue)"
          label="Total Students"
          value={getStatValue(summary?.students)}
          trend="↑ 12% from last year"
          trendUp
        />
        <StatCard
          icon={<Users className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--green-light)]"
          iconColor="var(--green)"
          glowColor="var(--green)"
          label="Teachers"
          value={getStatValue(summary?.teachers)}
          trend="↑ 4 new this term"
          trendUp
        />
        <StatCard
          icon={<BookOpen className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--cyan-light)]"
          iconColor="var(--cyan)"
          glowColor="var(--cyan)"
          label="Subjects"
          value={getStatValue(summary?.subjects)}
          trend="↑ 2 added this year"
          trendUp
        />
        <StatCard
          icon={<Building className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--amber-light)]"
          iconColor="var(--amber)"
          glowColor="var(--amber)"
          label="Classes"
          value={getStatValue(summary?.classes)}
          trend="↓ 1 merged"
          trendUp={false}
        />
      </div>

      {}
      <div className="grid grid-cols-[1fr_300px] gap-5 mb-[22px] max-lg:grid-cols-1">
        {}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
          <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[var(--border)] flex-wrap gap-2">
            <div>
              <div className="text-[17px] font-bold text-[var(--text)]">
                Recent Admissions
              </div>
              <div className="text-sm text-[var(--text-2)] mt-[2px]">
                Latest enrolled students
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[11px] text-[13.5px] font-semibold bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white shadow-[var(--shadow-blue)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-[180ms] relative overflow-hidden"
                onClick={() => router.push("/students")}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
                <span className="relative z-10 flex items-center gap-[7px]">
                  View All
                </span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["Student", "Class", "Guardian", "Status", "Date", ""].map(
                    h => (
                      <th
                        key={h}
                        className="px-[18px] py-[12px] text-left text-[11.5px] font-bold text-[var(--text-3)] uppercase tracking-[0.6px] bg-[var(--surface-2)] whitespace-nowrap border-b border-[var(--border)]"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-[18px] py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-[var(--text-3)] font-medium">
                          Loading admissions...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : recentAdmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-[18px] py-12 text-center text-sm text-[var(--text-3)]"
                    >
                      No recent admissions found
                    </td>
                  </tr>
                ) : (
                  recentAdmissions.map(student => {
                    const initials = getInitials(
                      student.user.firstName,
                      student.user.lastName,
                    );

                    const academic = student.academics?.[0];
                    const classNo = academic?.class?.classNo || "-";
                    const section = academic?.class?.section || "-";
                    const classStr = `${classNo}-${section}`;
                    const badgeVariant = getBadgeVariant(section);
                    const gradients: Record<string, string> = {
                      blue: "from-[#3d6cf4] to-[#6c47f5]",
                      indigo: "from-[#0ea5c9] to-[#3d6cf4]",
                      amber: "from-[#e08c17] to-[#e83b6a]",
                      rose: "from-[#6c47f5] to-[#3d6cf4]",
                      cyan: "from-[#12a47e] to-[#0ea5c9]",
                    };

                    return (
                      <tr
                        key={student.id}
                        className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors duration-[120ms]"
                      >
                        <td className="px-[18px] py-[13px]">
                          <div className="flex items-center gap-[10px]">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br ${gradients[badgeVariant]}`}
                            >
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-[13.5px]">
                                {student.user.firstName} {student.user.lastName}
                              </div>
                              <div className="text-[11px] text-[var(--text-2)]">
                                {student.admissionNo}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-[18px] py-[13px]">
                          <Badge variant={badgeVariant}>
                            {classStr == "---" ? "N/A" : classStr}
                          </Badge>
                        </td>
                        <td className="px-[18px] py-[13px] text-[var(--text-2)] text-[13.5px]">
                          {student.guardianName === null ? (
                            <Badge variant="amber">N/A</Badge>
                          ) : (
                            <Badge variant="green">
                              {student.guardianName}
                            </Badge>
                          )}
                        </td>
                        <td className="px-[18px] py-[13px]">
                          <Badge variant="green">
                            {student.status || "Active"}
                          </Badge>
                        </td>
                        <td className="px-[18px] py-[13px] text-[var(--text-2)] text-[12.5px]">
                          {formatDate(student.admissionDate)}
                        </td>
                        <td className="px-[18px] py-[13px]">
                          <button
                            onClick={() => handleEdit(student)}
                            disabled={loadingStudentId === student.id}
                            className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--blue-light)] hover:text-[var(--blue)] transition-all duration-150 border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingStudentId === student.id ? (
                              <div className="w-[15px] h-[15px] border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Edit className="w-[15px] h-[15px]" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div className="flex flex-col gap-[18px]">
          {}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="text-[15px] font-bold text-[var(--text)]">
                Quick Access
              </div>
            </div>
            <QuickItem
              icon={<Users className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--green-light)]"
              iconColor="var(--green)"
              label="Teachers"
              sub={`${getStatValue(summary?.teachers)} staff members`}
              onClick={() => router.push("/teachers")}
            />
            <QuickItem
              icon={<Users className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--blue-light)]"
              iconColor="var(--blue)"
              label="Students"
              sub={`${getStatValue(summary?.students)} enrolled`}
              onClick={() => router.push("/students")}
            />
            <QuickItem
              icon={<BookOpen className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--amber-light)]"
              iconColor="var(--amber)"
              label="Subjects"
              sub={`${getStatValue(summary?.subjects)} offered`}
              onClick={() => router.push("/subjects")}
            />
            <QuickItem
              icon={<Building className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--cyan-light)]"
              iconColor="var(--cyan)"
              label="Classes"
              sub={`${getStatValue(summary?.classes)} sections`}
              onClick={() => router.push("/classes")}
            />
          </div>

          {}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <div className="text-[16px] font-bold text-[var(--text)] tracking-tight">
                  Recent Teachers
                </div>
                <div className="text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider mt-0.5">
                  Latest Staff Additions
                </div>
              </div>
              <div className="bg-[var(--blue-light)] text-[var(--blue)] px-2 py-0.5 rounded-md text-[10px] font-bold">
                {recentTeachers.length}
              </div>
            </div>
            {recentTeachers.length > 0 ? (
              recentTeachers.map((teacher, index) => {
                const initials = getInitials(
                  teacher.user?.firstName,
                  teacher.user?.lastName,
                );
                const gradients: Record<string, string> = {
                  "0": "from-[#3d6cf4] to-[#6c47f5]",
                  "1": "from-[#0ea5c9] to-[#3d6cf4]",
                  "2": "from-[#e08c17] to-[#e83b6a]",
                  "3": "from-[#6c47f5] to-[#3d6cf4]",
                  "4": "from-[#12a47e] to-[#0ea5c9]",
                  "5": "from-[#3d6cf4] to-[#0ea5c9]",
                  "6": "from-[#6c47f5] to-[#e83b6a]",
                  "7": "from-[#e08c17] to-[#12a47e]",
                  "8": "from-[#0ea5c9] to-[#6c47f5]",
                  "9": "from-[#e83b6a] to-[#3d6cf4]",
                };
                const lastChar = teacher.id?.slice(-1) || "0";
                const gradientKey = /[0-9]/.test(lastChar)
                  ? lastChar
                  : String(index % 10);
                const gradientClass = gradients[gradientKey] || gradients["0"];
                const expYears = teacher.totalExpMonths
                  ? Math.floor(teacher.totalExpMonths / 12)
                  : 0;

                return (
                  <div
                    key={`${teacher.id}-${index}`}
                    onClick={() => router.push("/teachers")}
                    className="group flex gap-3.5 px-[22px] py-[15px] border-b border-[var(--border)] last:border-b-0 items-center hover:bg-[var(--surface-2)] transition-all duration-[200ms] cursor-pointer"
                  >
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0 bg-gradient-to-br shadow-inner ${gradientClass} transition-transform duration-300 group-hover:scale-105`}
                      >
                        {initials}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[14px] text-[var(--text)] font-bold truncate group-hover:text-[var(--blue)] transition-colors">
                          {teacher.user?.firstName} {teacher.user?.lastName}
                        </div>
                        <div className="text-[10px] font-bold text-[var(--text-3)] whitespace-nowrap bg-[var(--surface-3)] px-1.5 py-0.5 rounded uppercase tracking-tighter">
                          {teacher.employeeCode || "STAFF"}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--blue-light)] text-[var(--blue)] leading-none border border-[var(--blue)]/5">
                          {teacher.specialization ||
                            teacher.designation ||
                            "Staff"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-[11px] text-[var(--text-3)] font-medium">
                        <div className="flex items-center gap-1 truncate max-w-[120px]">
                          <span className="w-1 h-1 rounded-full bg-[var(--text-3)] opacity-40" />
                          {teacher.highestQualification || "Qualified"}
                        </div>
                        <span className="text-[var(--border)]">|</span>
                        <div className="flex items-center gap-1 text-[var(--text-2)]">
                          <span className="font-bold text-[var(--blue)]">
                            {expYears > 0 ? `${expYears}y` : "Fresh"}
                          </span>{" "}
                          Exp
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-[18px] py-6 text-center text-[13px] text-[var(--text-2)]">
                No recent teachers found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Student Modal */}
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
                firstName: editingStudent.user.firstName,
                middleName: editingStudent.user.middleName || "",
                lastName: editingStudent.user.lastName,
                email: editingStudent.user.email,
                phone: editingStudent.user.phone || "",
                admissionNo: editingStudent.admissionNo,
                rollNo: editingStudent.rollNo,
                admissionDate: new Date(editingStudent.admissionDate)
                  .toISOString()
                  .split("T")[0],
                fatherName: editingStudent.fatherName || "",
                fatherPhone: editingStudent.fatherPhone || "",
                motherName: editingStudent.motherName || "",
                guardianName: editingStudent.guardianName || "",
                familyAnnualIncome: editingStudent.familyAnnualIncome || "",
                medicalConditions: editingStudent.medicalConditions || "",
              }}
              onSubmitSuccess={handleEditSuccess}
              onClose={() => setEditingStudent(null)}
              roleId={role}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
