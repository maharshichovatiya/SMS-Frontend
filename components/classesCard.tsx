"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import ClassForm from "./forms/ClassForm";
import toast from "react-hot-toast";
import { deleteClass } from "@/lib/api/classes";
import { ClassItem } from "@/lib/types/class";

interface Props {
  cls: ClassItem;
  onSuccess?: () => void;
}

const getClassLevel = (classNo: string) => {
  const num = parseInt(classNo);
  if (num >= 1 && num <= 5) return "Junior";
  if (num >= 6 && num <= 8) return "Middle";
  if (num >= 9 && num <= 10) return "Secondary";
  if (num >= 11 && num <= 12) return "Senior";
  return "Unknown";
};

export default function ClassCard({ cls, onSuccess }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const teacherName = cls.classTeacher?.user
    ? `${cls.classTeacher.user.firstName} ${cls.classTeacher.user.lastName}`
    : (cls.classTeacher?.employeeCode ?? "Not assigned");

  const teacherInitials = cls.classTeacher?.user
    ? `${cls.classTeacher.user.firstName?.charAt(0)}${cls.classTeacher.user.lastName?.charAt(0)}`
    : "?";

  const level = getClassLevel(cls.classNo);

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

  const createdYear = new Date(cls.createdAt).getFullYear();
  const academicYear = `${createdYear}–${String(createdYear + 1).slice(2)}`;

  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-5 hover:shadow-[var(--shadow)] transition">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h2
            className="text-3xl font-extrabold leading-none"
            style={{ color: "var(--blue)" }}
          >
            {cls.classNo}
            <span className="text-2xl">-{cls.section}</span>
          </h2>
          <p className="text-xs text-[var(--text-3)] mt-1">{academicYear}</p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-medium border border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-2)]">
          {level}
        </span>
      </div>

      <div className="border-t border-[var(--border)] my-3" />

      <p className="text-sm font-bold text-[var(--text)] mb-2">
        Grade {cls.classNo} · Section {cls.section}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[8px] font-bold text-[var(--text-inverse)]"
          style={{ background: "var(--grad-primary)" }}
        >
          {teacherInitials}
        </div>
        <span className="text-xs text-[var(--text-2)] truncate">
          {teacherName}
        </span>
      </div>

      <div className="border-t border-[var(--border)] my-3" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-extrabold text-[var(--blue)] leading-none">
            {cls.studentCapacity}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-0.5">
            Capacity
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
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
