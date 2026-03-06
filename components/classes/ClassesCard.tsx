"use client";

import { Pencil, Trash2, LayoutList } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import ClassForm from "@/components/forms/ClassForm";
import ClassDetailModal from "@/components/classes/ClassDetailModal";
import ClassStudentsModal from "@/components/classes/ClassStudentsModal";
import { showToast } from "@/lib/utils/Toast";
import { deleteClass } from "@/lib/api/Classes";
import { ClassItem } from "@/lib/types/Class";
import { StudentAcademic } from "@/lib/types/Class";

interface Props {
  cls: ClassItem;
  onSuccess?: () => void;
}

const getClassLevel = (className: string | number) => {
  const str = String(className).trim().toLowerCase();
  if (str === "lkg" || str === "ukg") return "Pre-Primary";
  const num = parseInt(str);
  if (num >= 1 && num <= 8) return "Primary";
  if (num >= 9 && num <= 10) return "Secondary";
  if (num >= 11 && num <= 12) return "Higher Secondary";
  return "Unknown";
};

export default function ClassCard({ cls, onSuccess }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const teacherName = cls.classTeacher?.user
    ? `${cls.classTeacher.user.firstName} ${cls.classTeacher.user.lastName}`
    : (cls.classTeacher?.employeeCode ?? "Not assigned");

  const teacherInitials = cls.classTeacher?.user
    ? `${cls.classTeacher.user.firstName?.charAt(0)}${cls.classTeacher.user.lastName?.charAt(0)}`
    : "?";

  const level = getClassLevel(cls.className);
  const createdYear = new Date(cls.createdAt).getFullYear();
  const academicYear = `${createdYear}–${String(createdYear + 1).slice(2)}`;
  const subjectCount = cls.subjectCount ?? cls.classSubjects?.length ?? 0;
  const teacherCount = cls.teacherCount ?? 0;
  const availableSeats = (cls.studentCapacity ?? 0) - (cls.studentCount ?? 0);

  const studentAcademics =
    (cls.studentAcademics as StudentAcademic[] | undefined) ?? [];
  const validStudents = studentAcademics.filter(sa => sa.student !== null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteClass(cls.id);
      if (res.success) {
        showToast.success("Class deleted successfully");
        setOpenDelete(false);
        onSuccess?.();
      } else {
        showToast.error(res.message || "Failed to delete class");
      }
    } catch {
      showToast.error("Failed to delete class");
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setShowStudents(false);
  };

  return (
    <>
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-4 sm:p-5 hover:shadow-[var(--shadow)] transition cursor-pointer group"
        onClick={() => setOpenDetail(true)}
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black leading-none text-[var(--blue)]">
              {cls.className}
              <span className="text-xl sm:text-2xl font-extrabold">
                -{cls.section}
              </span>
            </h2>
            <p className="text-xs text-[var(--text-3)] mt-1 font-medium">
              {academicYear}
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-2)] font-medium">
            {level}
          </span>
        </div>

        <div className="border-t border-[var(--border)] my-3" />

        <p className="text-sm font-bold text-[var(--text)] mb-1.5">
          Class {cls.className} · Section {cls.section}
        </p>

        <div className="flex items-center gap-1.5 mb-3 min-w-0">
          <p className="text-xs text-[var(--text-3)] font-bold uppercase tracking-wide shrink-0">
            Class Teacher:
          </p>
          <p className="text-xs text-[var(--text-2)] capitalize font-medium truncate">
            {teacherName}
          </p>
        </div>

        {/* Subjects */}
        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
          {cls.classSubjects && cls.classSubjects.length > 0 ? (
            <>
              {cls.classSubjects.slice(0, 4).map(cs => (
                <span
                  key={cs.id}
                  className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-2)] font-medium"
                >
                  {cs.subject.subjectName}
                </span>
              ))}
              {cls.classSubjects.length > 4 && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-3)] bg-[var(--bg-2)] font-medium">
                  +{cls.classSubjects.length - 4}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-[var(--text-3)] italic">
              No subjects assigned
            </span>
          )}
        </div>

        <div className="border-t border-[var(--border)] my-3" />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
          {[
            { label: "Students", value: cls.studentCount ?? 0 },
            { label: "Subjects", value: subjectCount },
            { label: "Teachers", value: teacherCount },
            { label: "Capacity", value: cls.studentCapacity },
            { label: "Available", value: availableSeats },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-lg sm:text-xl font-extrabold text-[var(--text)]">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold uppercase text-[var(--text-3)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-between pt-2.5 border-t border-[var(--border)]">
          <button
            onClick={e => {
              e.stopPropagation();
              setOpenDetail(true);
            }}
            className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
          >
            <LayoutList size={12} /> View
          </button>
          <div className="flex gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                setOpenEdit(true);
              }}
              className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
            >
              <Pencil size={11} /> Edit
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                setOpenDelete(true);
              }}
              className="flex items-center cursor-pointer gap-1 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        </div>
      </div>

      {showStudents ? (
        <ClassStudentsModal
          isOpen={openDetail}
          onClose={handleCloseDetail}
          onBack={() => setShowStudents(false)}
          className={cls.className}
          section={cls.section}
          validStudents={validStudents}
          availableSeats={availableSeats}
        />
      ) : (
        <ClassDetailModal
          isOpen={openDetail}
          onClose={handleCloseDetail}
          cls={cls}
          teacherName={teacherName}
          teacherInitials={teacherInitials}
          level={level}
          academicYear={academicYear}
          subjectCount={subjectCount}
          teacherCount={teacherCount}
          availableSeats={availableSeats}
          onShowStudents={() => setShowStudents(true)}
        />
      )}

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
            className: String(cls.className),
            section: cls.section,
            studentCapacity: cls.studentCapacity,
            classTeacherId: cls.classTeacherId ?? undefined,
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
              className="flex-1 cursor-pointer py-2 rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)] transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 cursor-pointer py-2 rounded-[var(--radius-sm)] bg-[var(--rose)] text-[var(--text-inverse)] hover:bg-[var(--rose-dark)] transition font-semibold text-sm disabled:opacity-60"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <p className="text-sm text-[var(--text-2)]">
          Are you sure you want to delete{" "}
          <strong className="text-[var(--text)]">
            Class {cls.className} — Section {cls.section}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
}
