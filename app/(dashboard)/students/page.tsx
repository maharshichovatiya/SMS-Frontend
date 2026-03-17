"use client";
import StudentForm from "@/components/forms/StudentSections/StudentForm";
import StudentsTable from "@/components/tables/StudentTable";
import StudentFilters from "@/components/students/StudentFilters";
import StudentTableSkeleton from "@/components/skeletons/StudentTableSkeleton";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/layout/PageHeader";
import { RecordStatus } from "@/lib/api/Student";
import { useSelector, useDispatch } from "react-redux";
import {
  selectStudentFilters,
  selectStudentFiltersData,
  selectStudentFiltersLoading,
  selectStudentFiltersHasLoaded,
  fetchStudentFilterData,
} from "@/lib/store/StudentFiltersSlice";
import {
  fetchRoles,
  selectStudentRoleId,
  selectRolesLoading,
  selectRolesLoaded,
  selectStudentData,
  selectStudentTotal,
  selectStudentLoading,
  selectStudentPagination,
  selectSearchQuery,
  selectStatus,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setStatus,
  invalidateCache,
  fetchStudents,
} from "@/lib/store/StudentDataSlice";
import type { AppDispatch } from "@/lib/store/Index";
import { Users, Plus, Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

function Page() {
  // UI States (keep local)
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Redux selectors
  const filters = useSelector(selectStudentFilters);
  const { classes, academicYears } = useSelector(selectStudentFiltersData);
  const filtersLoading = useSelector(selectStudentFiltersLoading);
  const filtersHasLoaded = useSelector(selectStudentFiltersHasLoaded);
  const studentRoleId = useSelector(selectStudentRoleId);
  const rolesLoading = useSelector(selectRolesLoading);
  const rolesLoaded = useSelector(selectRolesLoaded);

  // Student data selectors
  const students = useSelector(selectStudentData);
  const totalStudents = useSelector(selectStudentTotal);
  const studentsLoading = useSelector(selectStudentLoading);

  // Pagination selectors
  const pagination = useSelector(selectStudentPagination);

  // UI State selectors (persistent across navigation)
  const searchQuery = useSelector(selectSearchQuery);
  const status = useSelector(selectStatus);

  const dispatch = useDispatch<AppDispatch>();

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch classes and academic years — only if never loaded before
  useEffect(() => {
    if (!filtersHasLoaded && !filtersLoading) {
      dispatch(fetchStudentFilterData());
    }
  }, [filtersHasLoaded, filtersLoading, dispatch]);

  // Fetch roles — only if never loaded before
  useEffect(() => {
    if (!rolesLoaded && !rolesLoading) {
      dispatch(fetchRoles());
    }
  }, [rolesLoaded, rolesLoading, dispatch]);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    dispatch(invalidateCache());
    dispatch(
      fetchStudents({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        searchParams: {
          search: debouncedSearch || undefined,
          status: status === "all" ? undefined : status,
          classId: filters.classId,
          academicYearId: filters.academicYearId,
          gender: filters.gender,
          fromDate: filters.fromDate,
          toDate: filters.toDate,
          fromFamilyIncome: filters.fromFamilyIncome
            ? parseInt(filters.fromFamilyIncome)
            : undefined,
          toFamilyIncome: filters.toFamilyIncome
            ? parseInt(filters.toFamilyIncome)
            : undefined,
        },
        forceRefresh: true,
      }),
    );
  }, [
    dispatch,
    debouncedSearch,
    status,
    filters,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  // Fetch students on mount and when search params change
  useEffect(() => {
    handleRefresh();
  }, [
    debouncedSearch,
    status,
    filters,
    pagination.currentPage,
    pagination.pageSize,
    handleRefresh,
  ]);

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${totalStudents} students enrolled · Academic Year`}
        icon={Users}
        iconBgColor="--blue-light"
        iconColor="--blue"
        buttonText="Admit Student"
        onButtonClick={() => setIsOpen(true)}
        buttonIcon={Plus}
      />

      <div className="flex items-center justify-between gap-4 mt-6 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: "all", label: "All" },
            { id: RecordStatus.ACTIVE, label: "Active" },
            { id: RecordStatus.INACTIVE, label: "Inactive" },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => dispatch(setStatus(s.id as RecordStatus | "all"))}
              className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
                status === s.id
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              }`}
              style={
                status === s.id
                  ? {
                      background: "var(--grad-primary)",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Search Bar and Filter Button - Right side */}
        <div className="flex items-center gap-3">
          <StudentFilters />

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={e => dispatch(setSearchQuery(e.target.value))}
              className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
            />
          </div>
        </div>
      </div>

      <div className="mt-3">
        {rolesLoading ? (
          <StudentTableSkeleton />
        ) : (
          <StudentsTable
            students={students}
            totalStudents={totalStudents}
            loading={studentsLoading}
            currentPage={pagination.currentPage}
            pageSize={pagination.pageSize}
            setCurrentPage={page => dispatch(setCurrentPage(page))}
            setPageSize={size => dispatch(setPageSize(size))}
            roleId={studentRoleId || ""}
            onRefresh={handleRefresh}
          />
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Admit New Student"
        description="Fill in the details below to register a new student."
      >
        <div className="w-[800px]">
          <StudentForm
            onClose={() => setIsOpen(false)}
            roleId={studentRoleId || ""}
            onSubmitSuccess={handleRefresh}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Page;
