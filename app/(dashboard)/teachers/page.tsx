"use client";
import TeacherForm from "@/components/forms/TeacherForm";
import TeacherCardSkeleton from "@/components/skeletons/TeacherCardSkeleton";
import TeacherCard from "@/components/TeachersCard";
import Modal from "@/components/ui/Modal";
import { getAllTeachers } from "@/lib/api/Teacher";
import { GetTeachers } from "@/lib/types/Teacher";
import { Plus, Search, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const DEPARTMENTS = [
  "all",
  "academic",
  "administration",
  "sports",
  "laboratory",
];

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<GetTeachers[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    const res = await getAllTeachers();
    if (res.success && res.data) {
      setTeachers(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    loadTeachers();
  }, []);

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
      {/* Header */}
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

      <div className="flex items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2 flex-wrap">
          {DEPARTMENTS.map(d => (
            <button
              key={d}
              onClick={() => setDepartment(d)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition capitalize ${
                department === d
                  ? "text-white border-transparent"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
              }`}
              style={
                department === d
                  ? {
                      background: "var(--grad-primary)",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--text-3)" }}
          />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 w-64"
          />
        </div>
      </div>

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
