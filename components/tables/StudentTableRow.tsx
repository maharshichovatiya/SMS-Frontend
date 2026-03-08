"use client";

import { Users } from "lucide-react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import StudentTableActions from "./StudentTableActions";
import { Student } from "./StudentTable";

interface StudentTableRowProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onAssignClass: (student: Student) => void;
  onStatusToggle: (student: Student) => void;
  togglingStatus?: string | null;
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function formatPhone(phone: string | undefined | null) {
  if (!phone) return "N/A";
  return `${phone.slice(0, 5)}  ${phone.slice(5)}`;
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

export default function StudentTableRow({
  student,
  onView,
  onEdit,
  onDelete,
  onAssignClass,
  onStatusToggle,
  togglingStatus,
}: StudentTableRowProps) {
  const fullName = `${student.firstName} ${student.lastName}`;
  const initials = getInitials(student.firstName, student.lastName);

  return (
    <tr
      key={student.id}
      className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors duration-[var(--duration-fast)]"
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--text-inverse)] text-xs font-bold flex-shrink-0 shadow-sm transition-transform hover:scale-105 cursor-pointer"
            style={{ background: "var(--grad-primary)" }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text)] whitespace-nowrap">
              {fullName}
            </p>
            <p className="text-xs font-semibold text-[var(--text-3)] flex items-center gap-1 mt-0.5">
              <span className="opacity-70">#</span>
              {student.rollNo}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4 min-w-[120px]">
        <div className="flex items-center gap-2 flex-nowrap">
          <span
            className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold whitespace-nowrap shadow-sm inline-block min-w-max ${
              student.class === "Unassigned"
                ? "bg-[var(--amber-light)] text-[var(--amber)] border border-[var(--amber-muted)]"
                : "bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue-muted)]"
            }`}
          >
            {student.class}
          </span>
          {student.class === "Unassigned" && (
            <button
              onClick={() => onAssignClass(student)}
              className="w-6 cursor-pointer h-6 rounded-full bg-[var(--blue)] text-white hover:bg-[var(--blue-dark)] flex items-center justify-center transition-colors duration-[var(--duration)]"
              title="Assign Class"
            >
              <Users size={11} />
            </button>
          )}
        </div>
      </td>

      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
        {student.academicYear || "N/A"}
      </td>

      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
        {student.dob}
      </td>

      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
        {student.guardian}
      </td>

      <td className="px-5 py-4 text-sm font-medium text-[var(--text-2)] whitespace-nowrap">
        {formatPhone(student.phone)}
      </td>

      <td className="px-5 py-4 text-sm text-[var(--text-2)] whitespace-nowrap">
        {formatAdmissionDate(student.admissionDate)}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <ToggleSwitch
            isOn={student.status === "Active"}
            onToggle={() => onStatusToggle(student)}
            disabled={togglingStatus === student.id}
          />
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
              ${
                student.status === "Active"
                  ? "bg-[var(--green-light)] text-[var(--green)]"
                  : "bg-[var(--rose-light)] text-[var(--rose)]"
              }
            `}
          >
            {student.status}
          </span>
        </div>
      </td>

      <StudentTableActions
        student={student}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </tr>
  );
}
