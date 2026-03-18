"use client";

import { useState, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/layout/Sidebar"), {
  ssr: false,
});

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [hasModalOpen, setHasModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkForModals = () => {
      const modals = document.querySelectorAll('[data-modal="true"]');
      setHasModalOpen(modals.length > 0);
    };

    checkForModals();

    const observer = new MutationObserver(checkForModals);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-modal"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-x-hidden relative">
      {hasModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 pointer-events-none" />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(prev => !prev)}
      />
      <main
        className="min-h-screen transition-all duration-300 ease-[var(--ease)]"
        style={{
          marginLeft: collapsed
            ? "calc(var(--sidebar-closed) + 20px)"
            : "calc(var(--sidebar-open) + 20px)",
          marginTop: "20px",
          padding: "10px 10px 68px",
        }}
      >
        {children}
      </main>
    </div>
  );
}
