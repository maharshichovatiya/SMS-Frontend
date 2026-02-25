"use client";
import { Building2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import ClassCard from "@/components/classesCard";
import ClassForm from "@/components/forms/ClassForm";
import Modal from "@/components/ui/Modal";
import { getAllClasses } from "@/lib/api/classes";
import { ClassItem } from "@/lib/types/class";
import ClassCardSkeleton from "@/components/skeletons/ClassCardSkeleton";

const GRADE_TABS = [
  { key: "all", label: "All Grades" },
  { key: "junior", label: "Junior (1–5)" },
  { key: "middle", label: "Middle (6–8)" },
  { key: "secondary", label: "Secondary (9–10)" },
  { key: "senior", label: "Senior (11–12)" },
];

function Page() {
  const [active, setActive] = useState("all");
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClasses = useCallback(async () => {
    setLoading(true);
    const res = await getAllClasses();

    if (res.success && res.data) {
      setClasses(Array.isArray(res.data) ? res.data : []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadClasses();
  }, []);

  return (
    <div>
      <div
        className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--cyan-light)] flex items-center justify-center">
            <Building2
              className="w-5 h-5 text-[var(--cyan)]"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
              Classes
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">
              {loading
                ? "Loading..."
                : `${classes.length} sections · Academic Year 2026`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10"
        >
          <span className="text-lg leading-none">+</span>
          Create Class
        </button>
      </div>

      <div className="flex mt-3 items-center gap-2 flex-wrap">
        {GRADE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-[var(--duration)] whitespace-nowrap ${
              active === tab.key
                ? "bg-[var(--blue)] text-[var(--text-inverse)]"
                : "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ClassCardSkeleton />
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)]">
          <Building2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">No classes found</p>
          <p className="text-sm">
            Click &quot;Create Class&quot; to get started.
          </p>
        </div>
      ) : (
        <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes?.map(cls => (
            <ClassCard key={cls.id} cls={cls} onSuccess={loadClasses} />
          ))}
        </div>
      )}

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add New Class"
        description="Fill in the details to create a new class."
      >
        <ClassForm
          onCancel={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            loadClasses();
          }}
        />
      </Modal>
    </div>
  );
}

export default Page;
