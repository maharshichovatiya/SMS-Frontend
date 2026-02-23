"use client";

import {
  Users,
  BookOpen,
  Building,
  Search,
  Bell,
  Plus,
  Edit,
} from "lucide-react";

// ── Stat Card ──
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
  trend,
  trendUp,
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
      <div
        className={`text-sm font-semibold ${trendUp ? "text-[var(--green)]" : "text-[var(--rose)]"}`}
      >
        {trend}
      </div>
    </div>
  );
}

// ── Badge ──
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

// ── Recent Admissions Data ──
const admissions = [
  {
    initials: "AK",
    name: "Arjun Kumar",
    id: "ST-2026-001",
    cls: "10-A",
    clsVariant: "blue" as BadgeVariant,
    guardian: "Ramesh Kumar",
    status: "Active",
    statusVariant: "green" as BadgeVariant,
    date: "Feb 14",
    gradient: "from-[#3d6cf4] to-[#6c47f5]",
  },
  {
    initials: "PS",
    name: "Priya Shah",
    id: "ST-2026-002",
    cls: "9-B",
    clsVariant: "indigo" as BadgeVariant,
    guardian: "Neha Shah",
    status: "Active",
    statusVariant: "green" as BadgeVariant,
    date: "Feb 14",
    gradient: "from-[#0ea5c9] to-[#3d6cf4]",
  },
  {
    initials: "MR",
    name: "Mihir Rao",
    id: "ST-2026-003",
    cls: "11-C",
    clsVariant: "amber" as BadgeVariant,
    guardian: "Sunita Rao",
    status: "Pending",
    statusVariant: "amber" as BadgeVariant,
    date: "Feb 16",
    gradient: "from-[#e08c17] to-[#e83b6a]",
  },
  {
    initials: "DM",
    name: "Divya Mehta",
    id: "ST-2026-004",
    cls: "8-A",
    clsVariant: "blue" as BadgeVariant,
    guardian: "Vijay Mehta",
    status: "Active",
    statusVariant: "green" as BadgeVariant,
    date: "Feb 17",
    gradient: "from-[#6c47f5] to-[#3d6cf4]",
  },
  {
    initials: "RJ",
    name: "Rohit Joshi",
    id: "ST-2026-005",
    cls: "12-B",
    clsVariant: "cyan" as BadgeVariant,
    guardian: "Kamla Joshi",
    status: "Inactive",
    statusVariant: "rose" as BadgeVariant,
    date: "Feb 18",
    gradient: "from-[#12a47e] to-[#0ea5c9]",
  },
];

// ── Role Bar ──
interface RoleBarProps {
  label: string;
  count: string;
  width: string;
  color: string;
}

function RoleBar({ label, count, width, color }: RoleBarProps) {
  return (
    <div className="flex items-center justify-between px-[18px] py-[11px] border-b border-[var(--border)] last:border-b-0">
      <div>
        <div className="text-[14.5px] font-medium">{label}</div>
        <div className="text-[12.5px] text-[var(--text-2)]">{count}</div>
      </div>
      <div className="w-20 h-[5px] bg-[var(--bg-2)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width, background: color }}
        />
      </div>
    </div>
  );
}

// ── Quick Access Item ──
interface QuickItemProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  sub: string;
}

function QuickItem({ icon, iconBg, iconColor, label, sub }: QuickItemProps) {
  return (
    <div className="flex items-center gap-3 px-[18px] py-[13px] border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-[var(--surface-2)] transition-colors duration-[120ms]">
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
  return (
    <>
      {/* ── TOPBAR ── */}
      <div className="flex items-center justify-between mb-7 flex-wrap gap-[14px]">
        <div>
          <div className="text-[11px] font-bold tracking-[0.8px] uppercase text-[var(--blue)] mb-[3px]">
            Overview
          </div>
          <div className="text-[25px] font-extrabold text-[var(--text)] tracking-[-0.6px]">
            Good morning, Admin 👋
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          {/* Search */}
          <div className="flex items-center gap-2 bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[11px] px-[14px] py-[9px] w-[220px] focus-within:border-[var(--border-focus)] focus-within:shadow-[0_0_0_3px_var(--blue-muted)] transition-all duration-200">
            <Search className="w-[14px] h-[14px] text-[var(--text-3)] flex-shrink-0" />
            <input
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[13.5px] text-[var(--text)] w-full placeholder-[var(--text-3)]"
            />
          </div>
          {/* Bell */}
          <div className="relative w-10 h-10 bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-[11px] flex items-center justify-center cursor-pointer text-[var(--text-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition-all duration-[180ms]">
            <Bell className="w-[17px] h-[17px]" />
            <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-[var(--rose)] rounded-full border-[1.5px] border-white" />
          </div>
          {/* CTA */}
          <button className="flex items-center gap-[7px] px-5 py-[10px] bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-[11px] text-[13.5px] font-semibold shadow-[var(--shadow-blue)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-[180ms] whitespace-nowrap relative overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            <span className="relative z-10 flex items-center gap-[7px]">
              <Plus className="w-[14px] h-[14px]" /> Add Record
            </span>
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-4 gap-4 mb-[22px] max-xl:grid-cols-2">
        <StatCard
          icon={<Users className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--blue-light)]"
          iconColor="var(--blue)"
          glowColor="var(--blue)"
          label="Total Students"
          value="1,284"
          trend="↑ 12% from last year"
          trendUp
        />
        <StatCard
          icon={<Users className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--green-light)]"
          iconColor="var(--green)"
          glowColor="var(--green)"
          label="Teachers"
          value="86"
          trend="↑ 4 new this term"
          trendUp
        />
        <StatCard
          icon={<BookOpen className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--cyan-light)]"
          iconColor="var(--cyan)"
          glowColor="var(--cyan)"
          label="Subjects"
          value="34"
          trend="↑ 2 added this year"
          trendUp
        />
        <StatCard
          icon={<Building className="w-[18px] h-[18px]" />}
          iconBg="bg-[var(--amber-light)]"
          iconColor="var(--amber)"
          glowColor="var(--amber)"
          label="Classes"
          value="42"
          trend="↓ 1 merged"
          trendUp={false}
        />
      </div>

      {/* ── SPLIT ROW ── */}
      <div className="grid grid-cols-[1fr_300px] gap-5 mb-[22px] max-lg:grid-cols-1">
        {/* Recent Admissions Table */}
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
              <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[11px] text-[13.5px] font-semibold bg-[var(--surface)] text-[var(--text-2)] border-[1.5px] border-[var(--border)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-all duration-[180ms]">
                Export
              </button>
              <button className="flex items-center gap-[7px] px-[14px] py-[8px] rounded-[11px] text-[13.5px] font-semibold bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white shadow-[var(--shadow-blue)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-[180ms] relative overflow-hidden">
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
                {admissions.map(s => (
                  <tr
                    key={s.id}
                    className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-2)] transition-colors duration-[120ms]"
                  >
                    <td className="px-[18px] py-[13px]">
                      <div className="flex items-center gap-[10px]">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-gradient-to-br ${s.gradient}`}
                        >
                          {s.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[13.5px]">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-[var(--text-2)]">
                            {s.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[18px] py-[13px]">
                      <Badge variant={s.clsVariant}>{s.cls}</Badge>
                    </td>
                    <td className="px-[18px] py-[13px] text-[var(--text-2)] text-[13.5px]">
                      {s.guardian}
                    </td>
                    <td className="px-[18px] py-[13px]">
                      <Badge variant={s.statusVariant}>{s.status}</Badge>
                    </td>
                    <td className="px-[18px] py-[13px] text-[var(--text-2)] text-[12.5px]">
                      {s.date}
                    </td>
                    <td className="px-[18px] py-[13px]">
                      <button className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--blue-light)] hover:text-[var(--blue)] transition-all duration-150 border-none bg-transparent">
                        <Edit className="w-[15px] h-[15px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-[18px]">
          {/* Quick Access */}
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
              sub="86 staff members"
            />
            <QuickItem
              icon={<Users className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--blue-light)]"
              iconColor="var(--blue)"
              label="Students"
              sub="1,284 enrolled"
            />
            <QuickItem
              icon={<BookOpen className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--amber-light)]"
              iconColor="var(--amber)"
              label="Subjects"
              sub="34 offered"
            />
            <QuickItem
              icon={<Building className="w-[18px] h-[18px]" />}
              iconBg="bg-[var(--cyan-light)]"
              iconColor="var(--cyan)"
              label="Classes"
              sub="42 sections"
            />
          </div>

          {/* Activity Feed */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] overflow-hidden">
            <div className="px-[22px] py-[18px] border-b border-[var(--border)]">
              <div className="text-[15px] font-bold text-[var(--text)]">
                Activity Feed
              </div>
            </div>
            {[
              {
                dot: "var(--blue)",
                text: (
                  <>
                    <strong className="text-[var(--text)] font-semibold">
                      Arjun Kumar
                    </strong>{" "}
                    admitted to Class 10-A
                  </>
                ),
                time: "2 hrs ago",
              },
              {
                dot: "var(--green)",
                text: (
                  <>
                    <strong className="text-[var(--text)] font-semibold">
                      Sunita Mishra
                    </strong>{" "}
                    salary updated
                  </>
                ),
                time: "4 hrs ago",
              },
              {
                dot: "var(--cyan)",
                text: (
                  <>
                    Subject{" "}
                    <strong className="text-[var(--text)] font-semibold">
                      Computer Science
                    </strong>{" "}
                    added
                  </>
                ),
                time: "Yesterday",
              },
              {
                dot: "var(--amber)",
                text: (
                  <>
                    Class{" "}
                    <strong className="text-[var(--text)] font-semibold">
                      12-B
                    </strong>{" "}
                    updated for 2025–26
                  </>
                ),
                time: "Yesterday",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex gap-3 px-[18px] py-3 border-b border-[var(--border)] last:border-b-0 items-start"
              >
                <div
                  className="w-2 h-2 rounded-full mt-[5px] flex-shrink-0"
                  style={{ background: a.dot }}
                />
                <div>
                  <div className="text-[13px] text-[var(--text-2)] leading-relaxed">
                    {a.text}
                  </div>
                  <div className="text-[11px] text-[var(--text-3)] mt-[3px]">
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
