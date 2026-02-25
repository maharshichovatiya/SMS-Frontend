"use client";

import { Pencil, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import TeacherForm from "./forms/TeacherForm";
import { GetTeachers } from "@/lib/types/teacher";
import toast from "react-hot-toast";
import { deleteTeacher } from "@/lib/api/teacher";

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

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 sm:p-6 hover:shadow-[var(--shadow)] transition">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-[var(--text)] truncate">
            {fullName}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-2)] truncate">
            {teacher.designation}
          </p>
        </div>
        <span className="shrink-0 text-xs bg-[var(--blue-light)] text-[var(--blue)] px-2 sm:px-3 py-1 rounded-full font-medium">
          {teacher.staffCategory}
        </span>
      </div>

      <div className="flex items-start gap-3 sm:gap-4 mt-4">
        {teacher.user.profilePhoto ? (
          <img
            src={teacher.user.profilePhoto}
            alt={fullName}
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[var(--radius-md)] object-cover"
          />
        ) : (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[var(--radius-md)] text-[var(--text-inverse)] flex items-center justify-center font-semibold text-lg"
            style={{ background: "var(--grad-primary)" }}
          >
            {initials}
          </div>
        )}

        <div className="text-xs sm:text-sm text-[var(--text-2)] space-y-1 min-w-0 flex-1">
          <p className="font-medium text-[var(--text)] truncate">
            {teacher.department}
          </p>
          <p className="truncate">{teacher.highestQualification}</p>
          <p>{teacher.totalExpMonths} months experience</p>
          <p className="flex items-center gap-1 truncate">
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{teacher.user.email}</span>
          </p>
          <p className="flex items-center gap-1">
            <Phone size={12} className="shrink-0" />
            {teacher.user.phone}
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] my-4" />

      <div className="text-xs sm:text-sm text-[var(--text-2)] grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1.5">
        <p className="flex items-center gap-1.5">
          <Calendar size={12} className="shrink-0" />
          DOB: {teacher.user.dob}
        </p>
        <p>Joined: {teacher.dateOfJoining}</p>
        <p className="truncate">Code: {teacher.employeeCode}</p>
        <p>₹{teacher.salaryPackage.toLocaleString()}/mo</p>
      </div>

      <div className="flex gap-2 sm:gap-3 mt-5">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
        >
          <Trash2 size={14} /> Delete
        </button>
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
              className="flex-1 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)] transition"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(teacher.id)}
              disabled={deleting}
              className="flex-1 py-2 rounded-[var(--radius-sm)] bg-[var(--rose)] text-[var(--text-inverse)] hover:bg-[var(--rose-dark)] transition font-semibold disabled:opacity-60"
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
