"use client";

import { useState, ReactNode, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(prev => !prev)}
      />
      <main
        className="min-h-screen transition-all duration-300 ease-[var(--ease)]"
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
