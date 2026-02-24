"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import StudentForm from "@/components/forms/StudentForm";

type Status = "Active" | "Pending" | "Inactive";

interface Student {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
  schoolId: string;
  phone: number;
  admissionNo: number;
  rollNo: number;
  admissionDate: string;
  class: string;
  dob: string;
  guardian: string;
  status: Status;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function formatAdmissionDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function formatPhone(phone: number) {
  const s = phone.toString();
  return `+91  ${s.slice(0, 5)}  ${s.slice(5)}`;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: "1",
    firstName: "Man",
    middleName: "kumar",
    lastName: "Lakhani",
    email: "mohdkadiwal786@gmail.com",
    password: "man123",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9099330195,
    admissionNo: 440,
    rollNo: 1,
    admissionDate: "2026-01-01",
    class: "10-A",
    dob: "12 Mar 2010",
    guardian: "Ramesh Kumar",
    status: "Active",
  },
  {
    id: "2",
    firstName: "Priya",
    middleName: "",
    lastName: "Shah",
    email: "priya.shah@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9123456789,
    admissionNo: 441,
    rollNo: 2,
    admissionDate: "2026-02-14",
    class: "9-B",
    dob: "05 Jul 2011",
    guardian: "Neha Shah",
    status: "Active",
  },
  {
    id: "3",
    firstName: "Mihir",
    middleName: "",
    lastName: "Rao",
    email: "mihir.rao@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9765432189,
    admissionNo: 442,
    rollNo: 3,
    admissionDate: "2026-02-16",
    class: "11-C",
    dob: "20 Sep 2009",
    guardian: "Sunita Rao",
    status: "Pending",
  },
  {
    id: "4",
    firstName: "Divya",
    middleName: "",
    lastName: "Mehta",
    email: "divya.mehta@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9345678901,
    admissionNo: 443,
    rollNo: 4,
    admissionDate: "2026-02-17",
    class: "8-A",
    dob: "17 Jan 2012",
    guardian: "Vijay Mehta",
    status: "Active",
  },
  {
    id: "5",
    firstName: "Rohit",
    middleName: "",
    lastName: "Joshi",
    email: "rohit.joshi@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9988776654,
    admissionNo: 444,
    rollNo: 5,
    admissionDate: "2026-02-18",
    class: "12-B",
    dob: "03 Nov 2008",
    guardian: "Kamla Joshi",
    status: "Inactive",
  },
  {
    id: "6",
    firstName: "Kavya",
    middleName: "",
    lastName: "Patel",
    email: "kavya.patel@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 8876554321,
    admissionNo: 445,
    rollNo: 6,
    admissionDate: "2026-02-19",
    class: "7-A",
    dob: "29 Apr 2013",
    guardian: "Ritu Patel",
    status: "Active",
  },
  {
    id: "7",
    firstName: "Aditya",
    middleName: "",
    lastName: "Sharma",
    email: "aditya.sharma@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9800111234,
    admissionNo: 446,
    rollNo: 7,
    admissionDate: "2026-02-20",
    class: "10-B",
    dob: "11 Jun 2010",
    guardian: "Suresh Sharma",
    status: "Active",
  },
  {
    id: "8",
    firstName: "Neha",
    middleName: "",
    lastName: "Gupta",
    email: "neha.gupta@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 8765432100,
    admissionNo: 447,
    rollNo: 8,
    admissionDate: "2026-02-20",
    class: "9-A",
    dob: "22 Feb 2011",
    guardian: "Amit Gupta",
    status: "Pending",
  },
  {
    id: "9",
    firstName: "Vikram",
    middleName: "",
    lastName: "Singh",
    email: "vikram.singh@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9512345678,
    admissionNo: 448,
    rollNo: 9,
    admissionDate: "2026-02-21",
    class: "11-C",
    dob: "14 Aug 2009",
    guardian: "Rajesh Singh",
    status: "Active",
  },
  {
    id: "10",
    firstName: "Sneha",
    middleName: "",
    lastName: "Desai",
    email: "sneha.desai@school.com",
    password: "",
    roleId: "df69bae9-3782-4e09-be65-ab8f2160e729",
    schoolId: "3a3c6eab-76ef-4a9f-ac8b-dd162acf98a5",
    phone: 9876501234,
    admissionNo: 449,
    rollNo: 10,
    admissionDate: "2026-02-22",
    class: "12-B",
    dob: "30 Oct 2008",
    guardian: "Hema Desai",
    status: "Inactive",
  },
];

const PAGE_SIZE = 6;
const TOTAL_STUDENTS = 1284;

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Edit modal state ──
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // ── Delete modal state ──
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Pagination ──
  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedStudents = students.slice(start, start + PAGE_SIZE);

  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));

  const handleEdit = (student: Student) => setEditingStudent(student);
  const handleEditSuccess = () => setEditingStudent(null);

  const handleDeleteClick = (student: Student) => setDeletingStudent(student);

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      setStudents(prev => prev.filter(s => s.id !== deletingStudent.id));
      // TODO: await fetch(`/api/students/${deletingStudent.id}`, { method: "DELETE" })
      setDeletingStudent(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* ── Edit Modal ── */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student"
        description="Update the student's information below."
      >
        <div className="w-[560px]">
          {editingStudent && (
            <StudentForm
              initialData={{
                firstName: editingStudent.firstName,
                middleName: editingStudent.middleName,
                lastName: editingStudent.lastName,
                email: editingStudent.email,
                phone: String(editingStudent.phone),
                admissionNo: String(editingStudent.admissionNo),
                rollNo: String(editingStudent.rollNo),
                admissionDate: editingStudent.admissionDate,
              }}
              onSubmitSuccess={handleEditSuccess}
              onclose={() => setEditingStudent(null)}
            />
          )}
        </div>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        title="Delete Student"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeletingStudent(null)}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-5 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--rose)] rounded-[var(--radius-sm)] hover:bg-[var(--rose-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </button>
          </>
        }
      >
        <div className="w-[380px] flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 rounded-full bg-[var(--rose-light)] flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-[var(--rose)]" />
          </div>
          <p className="text-sm text-[var(--text-3)]">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[var(--text)]">
              {deletingStudent?.firstName} {deletingStudent?.lastName}
            </span>{" "}
            (ST-2026-{String(deletingStudent?.admissionNo).padStart(3, "0")})?{" "}
            This action cannot be undone.
          </p>
        </div>
      </Modal>

      {/* ── Table ── */}
      <div
        className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] overflow-hidden"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {[
                  "Student",
                  "Class",
                  "DOB",
                  "Guardian",
                  "Contact",
                  "Admitted",
                  "Status",
                  "",
                ].map(col => (
                  <th
                    key={col}
                    className="px-5 py-3 text-left text-[11px] font-bold tracking-widest text-[var(--text-3)] uppercase whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedStudents.map(student => {
                const fullName = `${student.firstName} ${student.lastName}`;
                const initials = getInitials(
                  student.firstName,
                  student.lastName,
                );
                const studentCode = `ST-2026-${String(student.admissionNo).padStart(3, "0")}`;

                return (
                  <tr
                    key={student.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--duration-fast)]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-inverse)] text-sm font-bold flex-shrink-0 bg-[var(--blue)]">
                          {initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text)] whitespace-nowrap">
                            {fullName}
                          </p>
                          <p className="text-xs text-[var(--text-3)]">
                            {studentCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--blue-light)] text-[var(--blue)]">
                        {student.class}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                      {student.dob}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                      {student.guardian}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                      {formatPhone(student.phone)}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
                      {formatAdmissionDate(student.admissionDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                          ${student.status === "Active" ? "bg-[var(--green-light)] text-[var(--green)]" : ""}
                          ${student.status === "Pending" ? "bg-[var(--amber-light)] text-[var(--amber)]" : ""}
                          ${student.status === "Inactive" ? "bg-[var(--rose-light)]  text-[var(--rose)]" : ""}
                        `}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-[var(--text-3)] hover:text-[var(--blue)] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="text-[var(--text-3)] hover:text-[var(--rose)] transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-3)]">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, students.length)}{" "}
            of {TOTAL_STUDENTS.toLocaleString()} students
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-2)] bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-sm)] hover:bg-[var(--bg-2)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-semibold text-[var(--text-inverse)] bg-[var(--blue)] rounded-[var(--radius-sm)] hover:bg-[var(--blue-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
