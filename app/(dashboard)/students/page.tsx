"use client";
import StudentForm from "@/components/forms/StudentForm";
import StudentsTable from "@/components/tables/StudentTable";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/layout/PageHeader";
import { authApi, Role } from "@/lib/api/Auth";
import { RecordStatus } from "@/lib/api/Student";
import { showToast } from "@/lib/utils/Toast";
import { Users, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/UseDebounce";
function Page() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RecordStatus | "all">("all");
  const debouncedSearch = useDebounce(search, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("");
  const [rolesLoading, setRolesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [studentCount, setStudentCount] = useState<number>(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
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

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            size={16}
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
          />
        </div>
      </div>

      <div className="mt-3">
        {rolesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[var(--blue)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[var(--text-3)]">
                Loading student data...
              </span>
            </div>
          </div>
        ) : (
          <StudentsTable
            key={refreshKey}
            roleId={role}
            onRefresh={handleRefresh}
            onTotalCountChange={setStudentCount}
            searchParams={{
              search: debouncedSearch,
              status: status === "all" ? undefined : status,
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
