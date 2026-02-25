"use client";

import {
  Pencil,
  Trash2,
  BookOpen,
  User,
  GraduationCap,
  Users,
} from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import ClassForm from "./forms/ClassForm";

import toast from "react-hot-toast";
import { deleteClass } from "@/lib/api/classes";

export interface ClassTeacher {
  id: string;
  status: string;
  userId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  highestQualification: string;
  totalExpMonths: number;
  salaryPackage: string;
  dateOfJoining: string;

  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ClassItem {
  id: string;
  classNo: string;
  section: string;
  classTeacherId: string;
  studentCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  classTeacher: ClassTeacher;
}

interface Props {
  cls: ClassItem;
  onSuccess?: () => void;
}

export default function ClassCard({ cls, onSuccess }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const teacherName = cls.classTeacher?.user
    ? `${cls.classTeacher.user.firstName} ${cls.classTeacher.user.lastName}`
    : (cls.classTeacher?.employeeCode ?? "Not assigned");

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteClass(cls.id);
      if (res.success) {
        toast.success("Class deleted successfully");
        setOpenDelete(false);
        onSuccess?.();
      } else {
        toast.error(res.message || "Failed to delete class");
      }
    } catch {
      toast.error("Failed to delete class");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 sm:p-5 hover:shadow-[var(--shadow)] transition">
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-[var(--radius-md)] bg-[var(--cyan-light)] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-[var(--cyan)]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[var(--text)] truncate">
              Class {cls.classNo} — {cls.section}
            </h2>
            <p className="text-xs text-[var(--text-2)]">
              Section {cls.section}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${
            cls.status === "active"
              ? "bg-[var(--green-light)] text-[var(--green)]"
              : "bg-[var(--border)] text-[var(--text-3)]"
          }`}
        >
          {cls.status}
        </span>
      </div>

      <div className="border-t border-[var(--border)] my-3" />

      <div className="space-y-2 text-xs text-[var(--text-2)]">
        <p className="flex items-center gap-1.5">
          <User size={12} className="shrink-0 text-[var(--text-3)]" />
          <span className="text-[var(--text-3)]">Teacher:</span>
          <span className="text-[var(--text)] font-medium truncate">
            {teacherName}
          </span>
        </p>

        <p className="flex items-center gap-1.5">
          <GraduationCap size={12} className="shrink-0 text-[var(--text-3)]" />
          <span className="text-[var(--text-3)]">Designation:</span>
          <span className="text-[var(--text)] font-medium">
            {cls.classTeacher?.designation ?? "—"}
          </span>
        </p>

        <p className="flex items-center gap-1.5">
          <Users size={12} className="shrink-0 text-[var(--text-3)]" />
          <span className="text-[var(--text-3)]">Capacity:</span>
          <span className="text-[var(--text)] font-medium">
            {cls.studentCapacity} seats
          </span>
        </p>

        <p className="flex items-center gap-1.5">
          <span className="text-[var(--text-3)]">Department:</span>
          <span className="text-[var(--text)] font-medium capitalize">
            {cls.classTeacher?.department ?? "—"}
          </span>
        </p>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
        >
          <Pencil size={13} /> Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>

      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Class"
        description="Update the class details."
      >
        <ClassForm
          mode="edit"
          classId={cls.id}
          onCancel={() => setOpenEdit(false)}
          onSuccess={() => {
            setOpenEdit(false);
            onSuccess?.();
          }}
          defaultValues={{
            classNo: cls.classNo,
            section: cls.section,
            studentCapacity: cls.studentCapacity,
            classTeacherId: cls.classTeacherId,
          }}
        />
      </Modal>

      <Modal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        title="Delete Class"
        description="This action cannot be undone."
        footer={
          <>
            <button
              onClick={() => setOpenDelete(false)}
              className="flex-1 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)] transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 rounded-[var(--radius-sm)] bg-[var(--rose)] text-[var(--text-inverse)] hover:bg-[var(--rose-dark)] transition font-semibold text-sm disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--text-2)]">
          Are you sure you want to delete{" "}
          <strong className="text-[var(--text)]">
            Class {cls.classNo} — Section {cls.section}
          </strong>
          ?
        </p>
      </Modal>
    </div>
  );
}
