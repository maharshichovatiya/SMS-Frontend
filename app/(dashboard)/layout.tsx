"use client";

import { useState, ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main
        className="min-h-screen  transition-all duration-300 ease-[var(--ease)]"
        style={{
          marginLeft: collapsed
            ? "calc(var(--sidebar-closed) + 28px)"
            : "calc(var(--sidebar-open) + 28px)",
          padding: "28px 28px 0px",
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
