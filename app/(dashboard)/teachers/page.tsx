"use client";
import TeacherForm from "@/components/forms/TeacherForm";
import TeacherCardSkeleton from "@/components/skeletons/TeacherCardSkeleton";
import TeacherCard from "@/components/TeachersCard";
import TeacherFilters, {
  TeacherFilterValues,
} from "@/components/TeacherFilters";
import Modal from "@/components/ui/Modal";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";

const DEFAULT_FILTERS: TeacherFilterValues = {
  search: "",
  department: "all",
  experience: undefined,
  salary: undefined,
  ageGroup: undefined,
  tenure: undefined,
  gender: undefined,
  staffCategory: undefined,
  status: undefined,
};

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<GetTeachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TeacherFilterValues>(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 400);
    return () => clearTimeout(t);
  }, [filters.search]);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      const res = await getAllTeachers(
        debouncedSearch || undefined,
        filters.department !== "all" ? filters.department : undefined,
        filters.gender,
        filters.staffCategory,
        filters.status,
        filters.experience,
        filters.salary,
        filters.ageGroup,
        filters.tenure,
      );
      if (res.success && res.data) {
        setTeachers(res.data);
      }
      setLoading(false);
    };

    fetchTeachers();
  }, [refresh, debouncedSearch, filters]);

  const loadTeachers = () => setRefresh(prev => prev + 1);

  const hasActiveFilters =
    filters.department !== "all" ||
    !!filters.experience ||
    !!filters.salary ||
    !!filters.ageGroup ||
    !!filters.tenure ||
    !!filters.gender ||
    !!filters.staffCategory ||
    !!filters.status;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Teachers"
        description={
          loading ? "Loading..." : `${teachers.length} staff members`
        }
        icon={Users}
        iconBgColor="--green-light"
        iconColor="--green"
        buttonText="Add Teacher"
        onButtonClick={() => setOpen(true)}
        buttonIcon={Plus}
      />

      <TeacherFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters(DEFAULT_FILTERS)}
      />

      {loading ? (
        <TeacherCardSkeleton />
      ) : teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 sm:mt-24 text-[var(--text-2)] px-4 text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-30" />
          <p className="text-base sm:text-lg font-medium">
            {hasActiveFilters || filters.search
              ? "No results match your search"
              : "No teachers found"}
          </p>
          <p className="text-xs sm:text-sm">
            {hasActiveFilters || filters.search
              ? "Try adjusting your search or filters."
              : "Click Add Teacher to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {teachers.map(teacher => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onSuccess={loadTeachers}
            />
          ))}
        </div>
      )}

      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Add New Teacher"
          description="Fill in the details below to register a new staff member."
          className="max-w-3xl"
        >
          <TeacherForm
            onCancel={() => setOpen(false)}
            onSuccess={() => {
              setOpen(false);
              loadTeachers();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
