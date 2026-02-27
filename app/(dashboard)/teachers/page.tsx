"use client";
import TeacherForm from "@/components/forms/TeacherForm";
import TeacherCardSkeleton from "@/components/skeletons/TeacherCardSkeleton";
import TeacherCard from "@/components/TeachersCard";
import TeacherFilters from "@/components/TeacherFilters";
import Modal from "@/components/ui/Modal";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<GetTeachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      const res = await getAllTeachers();
      if (res.success && res.data) {
        setTeachers(res.data);
      }
      setLoading(false);
    };

    fetchTeachers();
  }, [refresh]);

  const loadTeachers = () => setRefresh(prev => prev + 1);

  const filtered = teachers.filter(teacher => {
    const fullName =
      `${teacher.user.firstName} ${teacher.user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      teacher.user.email.toLowerCase().includes(search.toLowerCase()) ||
      teacher.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(search.toLowerCase());

    const matchesDept =
      department === "all" || teacher.department.toLowerCase() === department;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen">
      <div className="w-full bg-[var(--surface)] rounded-[var(--radius-lg)] px-8 py-4 flex items-center justify-between border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--green-light)] flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--green)]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              Teachers
            </h1>
            <p className="text-sm text-[var(--text-2)] mt-1">
              {filtered.length} of {teachers.length} staff members
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      <TeacherFilters
        search={search}
        department={department}
        onSearchChange={setSearch}
        onDepartmentChange={setDepartment}
      />

      {loading ? (
        <TeacherCardSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 sm:mt-24 text-[var(--text-2)] px-4 text-center">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 mb-3 opacity-30" />
          <p className="text-base sm:text-lg font-medium">
            {teachers.length === 0
              ? "No teachers found"
              : "No results match your search"}
          </p>
          <p className="text-xs sm:text-sm">
            {teachers.length === 0
              ? "Click Add Teacher to get started."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {filtered.map(teacher => (
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
