"use client";

import React, { useEffect, useState } from "react";
import { Building2, Plus } from "lucide-react";
import ClassCard from "@/components/classes/ClassesCard";
import ClassForm from "@/components/forms/ClassForm";
import Modal from "@/components/ui/Modal";
import ClassFilters, {
  ClassFilterValues,
} from "@/components/classes/ClassFilters";
import ClassCardSkeleton from "@/components/skeletons/ClassCardSkeleton";
import { getClassSummary } from "@/lib/api/Classes";
import { ClassItem } from "@/lib/types/Class";
import PageHeader from "@/components/layout/PageHeader";

const DEFAULT_FILTERS: ClassFilterValues = {
  search: "",
  type: "all",
  availability: undefined,
  section: undefined,
  capacity: undefined,
  studentCount: undefined,
};

const PAGE_SIZE_OPTIONS = [6, 9, 12];
const DEFAULT_PAGE_SIZE = 6;

function Page() {
  const [filters, setFilters] = useState<ClassFilterValues>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalRecords, setTotalRecords] = useState(0);

  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      const res = await getClassSummary(
        debouncedSearch || undefined,
        filters.availability,
        filters.type !== "all" ? filters.type : undefined,
        filters.section,
        filters.capacity,
        filters.studentCount,
        currentPage,
        pageSize,
      );
      if (cancelled) return;
      if (res.success && Array.isArray(res.data)) {
        setClasses(res.data);
        setTotalRecords(res.total ?? 0);
      }
      setLoading(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    refresh,
    debouncedSearch,
    filters.availability,
    filters.type,
    filters.section,
    filters.capacity,
    filters.studentCount,
    pageSize,
  ]);

  const loadData = () => setRefresh(prev => prev + 1);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleFiltersChange = (val: ClassFilterValues) => {
    setCurrentPage(1);
    setFilters(val);
  };

  const handleClearFilters = () => {
    setCurrentPage(1);
    setFilters(DEFAULT_FILTERS);
  };

  const showingFrom = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalRecords);

  const hasAnyFilter =
    filters.type !== "all" ||
    !!filters.availability ||
    !!filters.section ||
    !!filters.capacity ||
    !!filters.studentCount ||
    !!filters.search;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Classes"
        description={
          loading
            ? "Loading..."
            : `${totalRecords} sections · Academic Year 2026`
        }
        icon={Building2}
        iconBgColor="--cyan-light"
        iconColor="--cyan"
        buttonText="Create Class"
        onButtonClick={() => setOpen(true)}
        buttonIcon={Plus}
      />

      <ClassFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <ClassCardSkeleton />
      ) : classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-[var(--text-2)]">
          <Building2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-lg font-medium">
            {hasAnyFilter ? "No results match your search" : "No classes found"}
          </p>
          <p className="text-sm">
            {hasAnyFilter
              ? "Try adjusting your search or filter."
              : `Click "Create Class" to get started.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(cls => (
              <ClassCard key={cls.id} cls={cls} onSuccess={loadData} />
            ))}
          </div>

          <div className="flex items-center justify-between px-5 py-4 mt-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-4">
              <p className="text-sm text-[var(--text-3)]">
                Showing {showingFrom}–{showingTo} of{" "}
                {totalRecords.toLocaleString()} classes
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[var(--text-3)]">
                  Rows per page:
                </label>
                <select
                  value={pageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-1 text-sm text-[var(--text)] bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--blue-muted)] cursor-pointer"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                ← Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--blue)] rounded-[var(--radius-sm)] hover:bg-[var(--blue-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>
        </>
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
