"use client";
import StudentForm from "@/components/forms/StudentForm";
import StudentsTable from "@/components/tables/StudentTable";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/layout/PageHeader";
import { authApi, Role } from "@/lib/api/Auth";
import { showToast } from "@/lib/utils/Toast";
import { Users, Plus } from "lucide-react";
import { useEffect, useState } from "react";

function Page() {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string>("");
  const [rolesLoading, setRolesLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
        description="90 students enrolled · Academic Year"
        icon={Users}
        iconBgColor="--blue-light"
        iconColor="--blue"
        buttonText="Admit Student"
        onButtonClick={() => setIsOpen(true)}
        buttonIcon={Plus}
      />

      <div className="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-md)] gap-4">
        <div className="relative flex-shrink-0 ml-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-52 transition-all duration-[var(--duration)]"
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
            searchParams={{
              search: search,
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
