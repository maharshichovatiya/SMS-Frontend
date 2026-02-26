"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Users,
  BookOpen,
  Building,
  ChevronLeft,
  GraduationCap,
  UserCircle,
  LogOut,
} from "lucide-react";
import { showToast } from "@/lib/utils/Toast";
import { logout } from "@/lib/api/Auth";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  badgeColor?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

function NavItem({
  icon,
  label,
  badge,
  badgeColor = "bg-[var(--green)]",
  active = false,
  collapsed = false,
  onClick,
}: NavItemProps) {
  const router = useRouter();

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-[11px] px-[10px] py-[10px] rounded-[10px] cursor-pointer text-sm font-medium transition-all duration-[180ms] mb-[3px] whitespace-nowrap overflow-hidden select-none group
    ${
      label == "Logout"
        ? "text-red-400 hover:bg-red-50 hover:text-red-500"
        : active
          ? "bg-[var(--blue-light)] text-[var(--blue)] font-semibold"
          : "text-[var(--text-2)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
    }`}
    >
      <div
        className={`w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0 transition-colors duration-[180ms]
    ${
      label == "Logout"
        ? "group-hover:bg-red-100"
        : active
          ? "bg-[var(--blue-muted)]"
          : "group-hover:bg-[var(--bg-2)]"
    }`}
      >
        {icon}
      </div>
      <span
        className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
      >
        {label}
      </span>

      {collapsed && (
        <span className="absolute left-[calc(100%+14px)] bg-[var(--text)] text-white text-xs font-medium px-3 py-[6px] rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
          {label}
        </span>
      )}
    </div>
  );
}

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      showToast.success("Logged out successfully");
      router.push("/signin");
    } else {
      showToast.error(res.message || "Failed to logout");
    }
  };
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/") return true;
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <aside
      className={`fixed left-[14px] top-1/2 -translate-y-1/2 h-[calc(100vh-40px)] bg-[var(--surface)] border border-[var(--border)] rounded-[22px] shadow-[var(--shadow)] flex flex-col z-[var(--z-sidebar)] transition-all duration-300 ease-[var(--ease)] overflow-hidden
        ${collapsed ? "w-[var(--sidebar-closed)]" : "w-[var(--sidebar-open)]"}`}
    >
      {}
      <div className="flex items-start gap-[11px] px-[18px] py-[22px] pb-[18px] border-b border-[var(--border)] relative">
        {}
        <button
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            onToggle?.();
          }}
          className={`absolute transition-all duration-300 z-20 w-[32px] h-[32px] bg-gradient-to-r from-[var(--blue)] to-[var(--indigo)] text-white rounded-full flex items-center justify-center cursor-pointer shadow-[var(--shadow-blue)] hover:-translate-y-0.5 active:translate-y-0 border border-white/20 ${
            collapsed
              ? "top-[22px] left-[50%] translate-x-[-50%]"
              : "top-[22px] right-10"
          }`}
          aria-label="Toggle sidebar"
          type="button"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-full" />
          <span
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""} relative z-10`}
          >
            <ChevronLeft className="w-4 h-4" />
          </span>
        </button>

        {}
        <div
          className={`flex items-center gap-[11px] transition-all duration-300 ${
            collapsed ? "w-full justify-center mt-16" : ""
          }`}
        >
          <div
            className={`transition-all duration-300 rounded-[var(--radius-sm)] flex items-center justify-center bg-gradient-to-br from-[var(--blue)] to-[var(--indigo)] backdrop-blur-sm border border-white/20 flex-shrink-0 ${
              collapsed ? "w-12 h-12" : "w-16 h-10 min-w-[64px]"
            }`}
            style={{ boxShadow: "var(--shadow-blue)" }}
          >
            <GraduationCap
              className={`transition-all duration-300 text-white ${
                collapsed ? "w-7 h-7" : "w-6 h-6"
              }`}
            />
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 overflow-y-auto  [&::-webkit-scrollbar]:hidden  overflow-x-hidden p-[10px] scrollbar-thin scrollbar-thumb-[var(--border-2)]">
        <div
          className={`text-[10px] font-bold tracking-[0.8px] uppercase text-[var(--text-3)] px-2 py-3 pb-1 whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}
        >
          Overview
        </div>
        <NavItem
          icon={<Home className="w-[18px] h-[18px]" />}
          label="Dashboard"
          active={isActive("/dashboard")}
          collapsed={collapsed}
          onClick={() => router.push("/dashboard")}
        />

        <div
          className={`text-[10px] font-bold tracking-[0.8px] uppercase text-[var(--text-3)] px-2 py-3 pb-1 whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}
        >
          Modules
        </div>

        {}
        <NavItem
          icon={<Users className="w-[18px] h-[18px]" />}
          label="Teachers"
          active={isActive("/teachers")}
          collapsed={collapsed}
          onClick={() => router.push("/teachers")}
        />

        {}
        <NavItem
          icon={<GraduationCap className="w-6 h-6" />}
          label="Students"
          active={isActive("/students")}
          collapsed={collapsed}
          onClick={() => router.push("/students")}
        />
        <NavItem
          icon={<BookOpen className="w-[18px] h-[18px]" />}
          label="Subjects"
          active={isActive("/subjects")}
          collapsed={collapsed}
          onClick={() => router.push("/subjects")}
        />
        <NavItem
          icon={<Building className="w-[18px] h-[18px]" />}
          label="Classes"
          active={isActive("/classes")}
          collapsed={collapsed}
          onClick={() => router.push("/classes")}
        />

        <div
          className={`text-[10px] font-bold tracking-[0.8px] uppercase text-[var(--text-3)] px-2 py-3 pb-1 whitespace-nowrap transition-opacity duration-200 ${collapsed ? "opacity-0" : "opacity-100"}`}
        >
          General
        </div>
        <NavItem
          icon={<UserCircle className="w-6 h-6" />}
          label="Profile"
          active={isActive("/profile")}
          collapsed={collapsed}
          onClick={() => router.push("/profile")}
        />

        <NavItem
          icon={<LogOut className="w-6 h-6" />}
          label="Logout"
          collapsed={collapsed}
          onClick={handleLogout}
        />
      </div>

      {}
      <div className="px-[10px] py-3 border-t border-[var(--border)] flex-shrink-0">
        <div className="flex items-center gap-[10px] px-[10px] py-[9px] rounded-[10px] cursor-pointer hover:bg-[var(--bg)] transition-colors duration-150 overflow-hidden">
          <div className="w-[34px] h-[34px] rounded-full bg-[var(--grad-primary)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AD
          </div>
          <div
            className={`overflow-hidden transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}
          >
            <div className="text-[13px] font-semibold text-[var(--text)] whitespace-nowrap">
              Admin User
            </div>
            <div className="text-[11px] text-[var(--text-2)] whitespace-nowrap">
              Super Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
