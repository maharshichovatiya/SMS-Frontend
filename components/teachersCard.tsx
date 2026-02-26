"use client";

import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import TeacherForm from "./forms/TeacherForm";
import { GetTeachers } from "@/lib/types/Teacher";
import toast from "react-hot-toast";
import { deleteTeacher } from "@/lib/api/Teacher";

interface Props {
  teacher: GetTeachers;
  onSuccess: () => void;
}

export default function TeacherCard({ teacher, onSuccess }: Props) {
  const fullName = `${teacher.user.firstName} ${teacher.user.lastName}`;
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const initials =
    teacher?.user.firstName?.charAt(0) + teacher?.user.lastName?.charAt(0);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const res = await deleteTeacher(id);
    setDeleting(false);
    if (res.success) {
      toast.success("Teacher deleted successfully");
      setOpenDelete(false);
      onSuccess();
    } else {
      toast.error(res.message || "Failed to delete teacher");
    }
  };

  const experienceYears = Math.floor(teacher.totalExpMonths / 12);

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow)] transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          {teacher.user.profilePhoto ? (
            <img
              src={teacher.user.profilePhoto}
              alt={fullName}
              className="w-14 h-14 shrink-0 rounded-[var(--radius-md)] object-cover"
            />
          ) : (
            <div
              className="w-14 h-14 shrink-0 rounded-[var(--radius-md)] flex items-center justify-center font-bold text-lg text-[var(--text-inverse)]"
              style={{ background: "var(--grad-primary)" }}
            >
              {initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[var(--text)] truncate leading-tight">
                  {fullName}
                </h2>
                <p className="text-xs text-[var(--text-2)] truncate mt-0.5">
                  {teacher.designation}
                </p>
              </div>
              <span className="shrink-0 text-xs bg-[var(--blue-light)] text-[var(--blue)] px-2.5 py-1 rounded-full font-semibold capitalize">
                {teacher.department}
              </span>
            </div>

            <p className="text-xs text-[var(--text-3)] mt-1.5 truncate">
              {teacher.highestQualification} · {teacher.designation}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-2)]">
            <span className="text-lg font-extrabold text-[var(--blue)] leading-none">
              {teacher.salaryPackage
                ? `₹${(Number(teacher.salaryPackage) / 1000).toFixed(0)}k`
                : "—"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Salary
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-2)]">
            <span className="text-lg font-extrabold text-[var(--green)] leading-none">
              {teacher.totalExpMonths ?? "—"}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Months Exp
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-2)]">
            <span className="text-lg font-extrabold text-[var(--amber)] leading-none">
              {experienceYears}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Years
            </span>
          </div>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Mail size={12} className="shrink-0 text-[var(--text-3)]" />
            <span className="truncate">{teacher.user.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Phone size={12} className="shrink-0 text-[var(--text-3)]" />
            <span>{teacher.user.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <Calendar size={12} className="shrink-0 text-[var(--text-3)]" />
            <span>DOB: {teacher.user.dob}</span>
            <span className="text-[var(--border)]">·</span>
            <span>Joined: {teacher.dateOfJoining}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-2)]">
            <BadgeCheck size={12} className="shrink-0 text-[var(--text-3)]" />
            <span>{teacher.employeeCode}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-[var(--border)]">
          <button
            onClick={() => setOpenEdit(true)}
            className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Teacher"
        description="Update the staff member's details."
      >
        <TeacherForm
          mode="edit"
          teacherId={teacher.id}
          onCancel={() => setOpenEdit(false)}
          onSuccess={() => {
            setOpenEdit(false);
            onSuccess();
          }}
          defaultValues={{
            email: teacher.user.email,
            firstName: teacher.user.firstName,
            lastName: teacher.user.lastName,
            phone: teacher.user.phone,
            gender: teacher.user.gender,
            dob: teacher.user.dob,
            employeeCode: teacher.employeeCode,
            staffCategory: teacher.staffCategory,
            department: teacher.department,
            designation: teacher.designation,
            dateOfJoining: teacher.dateOfJoining,
            salaryPackage: Number(teacher.salaryPackage),
            highestQualification: teacher.highestQualification,
            experienceYears: Math.floor(teacher.totalExpMonths / 12),
            profilePhoto: null,
          }}
        />
      </Modal>

      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Teacher"
        description="This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setOpenDelete(false)}
              className="flex-1 cursor-pointer py-2 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)] transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(teacher.id)}
              disabled={deleting}
              className="flex-1 cursor-pointer py-2 rounded-[var(--radius-sm)] bg-[var(--rose)] text-[var(--text-inverse)] hover:bg-[var(--rose-dark)] transition font-semibold disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--text-2)]">
          Are you sure you want to remove <strong>{fullName}</strong>?
        </p>
      </Modal>
    </div>
  );
}
