"use client";

import { FileText, CheckCircle, Star, Calendar, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import StatCard from "@/components/ui/StatCard";
import { ProfileData } from "@/lib/types/Profile";

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

interface HomeworkItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "graded";
  onClick?: () => void;
}

function HomeworkItem({
  icon,
  iconBg,
  iconColor,
  title,
  subject,
  dueDate,
  status,
  onClick,
}: HomeworkItemProps) {
  return (
    <div
      className="flex items-center gap-3 px-[18px] py-3 border-b border-[var(--border)] cursor-pointer transition-colors duration-120 hover:bg-[#fafbff] last:border-b-0"
      onClick={onClick}
    >
      <div
        className={`w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0 ${iconBg}`}
        style={{ color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold">{title}</div>
        <div className="text-[11px] text-[var(--text-2)]">
          {subject} · Due {dueDate}
        </div>
      </div>
      <span
        className={`ml-auto inline-flex items-center px-[11px] py-[3px] rounded-full text-[11.5px] font-semibold ${
          status === "pending"
            ? "bg-[var(--amber-light)] text-[var(--amber)]"
            : "bg-[var(--green-light)] text-[var(--green)]"
        }`}
      >
        {status === "pending" ? "Pending" : "Graded"}
      </span>
    </div>
  );
}

interface SubjectRowProps {
  badgeVariant: "blue" | "green" | "indigo" | "cyan";
  badgeText: string;
  subjectName: string;
  teacherName: string;
}

function SubjectRow({
  badgeVariant,
  badgeText,
  subjectName,
  teacherName,
}: SubjectRowProps) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[11px] border-b border-[var(--border)] last:border-b-0">
      <div className="flex items-center gap-2">
        <Badge variant={badgeVariant}>{badgeText}</Badge>
        <div>
          <div className="text-[13.5px] font-medium">{subjectName}</div>
          <div className="text-[11.5px] text-[var(--text-2)]">
            {teacherName}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard({
  profile,
}: {
  profile: ProfileData | null;
}) {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleViewAllHomework = () => {
    router.push("/homework");
  };

  const handleViewAllSubjects = () => {
    router.push("/subjects");
  };

  const handleHomeworkClick = () => {
    router.push("/homework");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-7 flex-wrap gap-[14px]">
        <div>
          <div className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px]">
            {getGreeting()}, {profile?.firstName || "Student"} 👋
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-[22px] max-xl:grid-cols-2">
        <StatCard
          icon={<FileText size={20} />}
          iconBg="bg-[var(--indigo-light)]"
          iconColor="var(--indigo)"
          glowColor="var(--indigo)"
          label="Pending Homework"
          value="3"
          trend="1 due tomorrow"
          trendUp={false}
          animationDelay="0.04s"
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          iconBg="bg-[var(--green-light)]"
          iconColor="var(--green)"
          glowColor="var(--green)"
          label="Submitted Homework"
          value="2"
          trend="Submit"
          trendUp={true}
          animationDelay="0.04s"
        />
        <StatCard
          icon={<Star size={20} />}
          iconBg="bg-[var(--blue-light)]"
          iconColor="var(--blue)"
          glowColor="var(--blue)"
          label="Graded Homework"
          value="1"
          trend="Grade"
          trendUp={true}
          animationDelay="0.04s"
        />
        <StatCard
          icon={<BookOpen size={20} />}
          iconBg="bg-[var(--blue-light)]"
          iconColor="var(--blue)"
          glowColor="var(--blue)"
          label="Resources"
          value="10"
          trend="Materials"
          trendUp={true}
          animationDelay="0.04s"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--text)]">
              Upcoming Homework
            </h3>
            <button
              onClick={handleViewAllHomework}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-3)] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-[var(--border)]">
            <HomeworkItem
              icon={<Calendar size={16} />}
              iconBg="bg-[var(--rose-light)]"
              iconColor="var(--rose)"
              title="Quadratic Equations"
              subject="Mathematics"
              dueDate="Mar 15"
              status="pending"
              onClick={handleHomeworkClick}
            />
            <HomeworkItem
              icon={<FileText size={16} />}
              iconBg="bg-[var(--blue-light)]"
              iconColor="var(--blue)"
              title="Climate Change Essay"
              subject="English"
              dueDate="Mar 18"
              status="pending"
              onClick={handleHomeworkClick}
            />
            <HomeworkItem
              icon={<CheckCircle size={16} />}
              iconBg="bg-[var(--green-light)]"
              iconColor="var(--green)"
              title="Chemical Reactions Lab"
              subject="Science"
              dueDate="Mar 10"
              status="graded"
              onClick={handleHomeworkClick}
            />
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--text)]">
              My Subjects
            </h3>
            <button
              onClick={handleViewAllSubjects}
              className="px-3 py-1.5 text-xs font-medium bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface-3)] transition-colors"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-[var(--border)]">
            <SubjectRow
              badgeVariant="blue"
              badgeText="Math"
              subjectName="Mathematics"
              teacherName="Sunita Mishra"
            />
            <SubjectRow
              badgeVariant="green"
              badgeText="Sci"
              subjectName="Science"
              teacherName="Vivek Pandey"
            />
            <SubjectRow
              badgeVariant="indigo"
              badgeText="Eng"
              subjectName="English"
              teacherName="Rekha Tiwari"
            />
            <SubjectRow
              badgeVariant="cyan"
              badgeText="CS"
              subjectName="Computer Science"
              teacherName="Vivek Pandey"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
