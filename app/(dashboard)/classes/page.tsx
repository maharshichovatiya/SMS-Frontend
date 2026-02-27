"use client";

import React, { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import ClassCard from "@/components/ClassesCard";
import ClassForm from "@/components/forms/ClassForm";
import Modal from "@/components/ui/Modal";
import ClassFilters from "@/components/ClassFilters";
import ClassCardSkeleton from "@/components/skeletons/ClassCardSkeleton";
import { getClassSummary } from "@/lib/api/Classes";
import { ClassItem } from "@/lib/types/Class";

const getGradeKey = (classNo: string | number) => {
  const num = parseInt(String(classNo));
  if (num >= 1 && num <= 5) return "junior";
  if (num >= 6 && num <= 8) return "middle";
  if (num >= 9 && num <= 10) return "secondary";
  // if (num >= 11 && num <= 12) return "senior";
  return "unknown";
};

function Page() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const res = await getClassSummary();
      if (res.success && Array.isArray(res.data)) {
        setClasses(res.data);
      }
      setLoading(false);
    };

    fetchClasses();
  }, [refresh]);

  const loadData = () => setRefresh(prev => prev + 1);

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
    <div className="space-y-4">
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

      <ClassFilters
        active={active}
        onTabChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cls => (
            <ClassCard key={cls.id} cls={cls} onSuccess={loadData} />
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
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}

export default Page;
