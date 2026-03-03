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
import PageHeader from "@/components/layout/PageHeader";

const TYPE_MAP: Record<string, string> = {
  all: "",
  primary: "Primary",
  upperPrimary: "UpperPrimary",
  secondary: "Secondary",
};

function Page() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      const type = TYPE_MAP[active] || undefined;
      const res = await getClassSummary(debouncedSearch || undefined, type);
      if (res.success && Array.isArray(res.data)) {
        setClasses(res.data);
      }
      setLoading(false);
    };

    fetchClasses();
  }, [refresh, debouncedSearch, active]);

  const loadData = () => setRefresh(prev => prev + 1);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Classes"
        description={
          loading
            ? "Loading..."
            : `${classes.length} sections · Academic Year 2026`
        }
        icon={Building2}
        iconBgColor="--cyan-light"
        iconColor="--cyan"
        buttonText="Create Class"
        onButtonClick={() => setOpen(true)}
        buttonIcon={Plus}
      />

      <ClassFilters
        active={active}
        onTabChange={setActive}
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <ClassCardSkeleton />
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)]">
          <Building2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">
            {search || active !== "all"
              ? "No results match your search"
              : "No classes found"}
          </p>
          <p className="text-sm">
            {search || active !== "all"
              ? "Try adjusting your search or filter."
              : `Click "Create Class" to get started.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map(cls => (
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
