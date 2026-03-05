"use client";
import StudentForm from "@/components/forms/StudentForm";
import StudentsTable from "@/components/tables/StudentTable";
import StudentFilters from "@/components/students/StudentFilters";
import StudentTableSkeleton from "@/components/skeletons/StudentTableSkeleton";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/layout/PageHeader";
import { authApi, Role } from "@/lib/api/Auth";
import { RecordStatus } from "@/lib/api/Student";
import { showToast } from "@/lib/utils/Toast";
import { Users, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface StudentFilters {
  classId?: string;
  academicYearId?: string;
  gender?: string;
  fromDate?: string;
  toDate?: string;
  fromFamilyIncome?: string;
  toFamilyIncome?: string;
}

function Page() {
  const [status, setStatus] = useState<RecordStatus | "all">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("");
  const [rolesLoading, setRolesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filters, setFilters] = useState<StudentFilters>({});

  // Debounce search query (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleFiltersChange = (newFilters: StudentFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };
  useEffect(() => {
    async function getStudentRoleID() {
      setRolesLoading(true);
      try {
        const res = await authApi.getRoles();
        const studentRole = res.data?.find(
          (role: Role) => role.roleName.toLowerCase() === "student",
        );
        if (studentRole) {
          setRole(studentRole.id);
        }
      } catch (err: unknown) {
        showToast.apiError(err);
      } finally {
        setRolesLoading(false);
      }
    }
    getStudentRoleID();
  }, []);

  return (
    <div>
      <PageHeader
        title="Students"
        description={`${studentCount} students enrolled · Academic Year`}
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
              onClick={() => setStatus(s.id as RecordStatus | "all")}
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
          <StudentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--text-3)" }}
            />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
            key={refreshKey}
            roleId={role}
            onRefresh={handleRefresh}
            onTotalCountChange={setStudentCount}
            searchParams={{
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
            }}
          />
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Admit New Student"
        description="Fill in the details below to register a new student."
      >
        <div className="w-[560px]">
          <StudentForm
            onClose={() => setIsOpen(false)}
            roleId={role}
            onSubmitSuccess={handleRefresh}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Page;
