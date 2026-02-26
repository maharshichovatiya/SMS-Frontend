"use client";
import { Building2, Plus, Search } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import ClassCard from "@/components/ClassesCard";
import ClassForm from "@/components/forms/ClassForm";
import Modal from "@/components/ui/Modal";
import { getAllClasses } from "@/lib/api/Classes";
import { ClassItem } from "@/lib/types/Class";
import ClassCardSkeleton from "@/components/skeletons/ClassCardSkeleton";

const GRADE_TABS = [
  { key: "all", label: "All" },
  { key: "junior", label: "Junior (1–5)" },
  { key: "middle", label: "Middle (6–8)" },
  { key: "secondary", label: "Secondary (9–10)" },
  { key: "senior", label: "Senior (11–12)" },
];

const getGradeKey = (classNo: string | number) => {
  const num = parseInt(String(classNo));
  if (num >= 1 && num <= 5) return "junior";
  if (num >= 6 && num <= 8) return "middle";
  if (num >= 9 && num <= 10) return "secondary";
  if (num >= 11 && num <= 12) return "senior";
  return "unknown";
};

function Page() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
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

  const filtered = classes.filter(cls => {
    const classNoStr = String(cls.classNo);
    const sectionStr = String(cls.section).toLowerCase();

    const matchesSearch =
      search === "" ||
      classNoStr.includes(search) ||
      sectionStr.includes(search.toLowerCase());

    const matchesGrade = active === "all" || getGradeKey(classNoStr) === active;

    return matchesSearch && matchesGrade;
  });

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
                : `${filtered.length} of ${classes.length} sections · Academic Year 2026`}
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10"
        >
          <Plus className="w-4 h-4" />
          Create Class
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {GRADE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition whitespace-nowrap ${
                active === tab.key
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              }`}
              style={
                active === tab.key
                  ? {
                      background: "var(--grad-primary)",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 w-56"
          />
        </div>
      </div>

      {loading ? (
        <ClassCardSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)]">
          <Building2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">
            {classes.length === 0
              ? "No classes found"
              : "No results match your search"}
          </p>
          <p className="text-sm">
            {classes.length === 0
              ? `Click "Create Class" to get started.`
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid mt-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cls => (
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
