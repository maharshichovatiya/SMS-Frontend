"use client";

import { Users } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

export default function AssignStudentsPage() {
  return (
    <div>
      <PageHeader
        title="Assign Students"
        description="Manage student assignments and class enrollments"
        icon={Users}
        iconBgColor="--blue-light"
        iconColor="--blue"
      />
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow)] p-16 text-center">
        <div className="w-20 h-20 bg-[var(--blue-light)] rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-[var(--blue)]" />
        </div>
        <h3 className="text-2xl font-bold text-[var(--text)] mb-3">
          Assign Students
        </h3>
        <p className="text-[var(--text-2)] max-w-md mx-auto">
          Student assignment functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}
