"use client";

import { BookOpen, Pencil, Trash2, LayoutList } from "lucide-react";
import { useState } from "react";
import Modal from "./ui/Modal";
import ClassForm from "./forms/ClassForm";
import { showToast } from "@/lib/utils/Toast";
import { deleteClass } from "@/lib/api/Classes";
import { ClassItem } from "@/lib/types/Class";

interface Props {
  cls: ClassItem;
  onSuccess?: () => void;
}

const getClassLevel = (classNo: string | number) => {
  const num = parseInt(String(classNo));
  if (num >= 1 && num <= 5) return "Junior";
  if (num >= 6 && num <= 8) return "Middle";
  if (num >= 9 && num <= 10) return "Secondary";
  if (num >= 11 && num <= 12) return "Senior";
  return "Unknown";
};

export default function ClassCard({ cls, onSuccess }: Props) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
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

  const createdYear = new Date(cls.createdAt).getFullYear();
  const academicYear = `${createdYear}–${String(createdYear + 1).slice(2)}`;
  const subjectCount = cls.subjectCount ?? cls.classSubjects?.length ?? 0;
  const teacherCount = cls.teacherCount ?? 0;

  return (
    <>
      <div
        className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-5 hover:shadow-[var(--shadow)] transition cursor-pointer group"
        onClick={() => setOpenDetail(true)}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-3xl font-black leading-none text-[var(--blue)]">
              {cls.classNo}
              <span className="text-2xl font-extrabold">-{cls.section}</span>
            </h2>
            <p className="text-xs text-[var(--text-3)] mt-1 font-medium">
              {academicYear}
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full border border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-2)] font-medium mt-1">
            {level}
          </span>
        </div>

        <div className="border-t border-[var(--border)] my-3" />

        <p className="text-sm font-bold text-[var(--text)] mb-1.5">
          Grade {cls.classNo} · Section {cls.section}
        </p>

        <div className="flex items-center gap-1.5 mb-3 min-w-0">
          <p className="text-xs text-[var(--text-3)] font-bold uppercase tracking-wide shrink-0">
            Class Teacher:
          </p>
          <p className="text-xs text-[var(--text-2)] capitalize font-medium truncate">
            {teacherName}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3 min-h-[22px]">
          {cls.classSubjects && cls.classSubjects.length > 0 ? (
            <>
              {cls.classSubjects.slice(0, 4).map(cs => (
                <span
                  key={cs.id}
                  className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)] bg-[var(--bg-2)] font-medium"
                >
                  {cs.subject.subjectName}
                </span>
              ))}
              {cls.classSubjects.length > 4 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-3)] bg-[var(--bg-2)] font-medium">
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

        <div className="flex items-end gap-5 mb-3">
          <div>
            <p className="text-xl font-extrabold leading-none text-[var(--blue)]">
              {cls.studentCount ?? 0}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mt-0.5">
              Students
            </p>
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none text-[var(--text)]">
              {subjectCount}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mt-0.5">
              Subjects
            </p>
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none text-[var(--text)]">
              {teacherCount}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mt-0.5">
              Teachers
            </p>
          </div>
          <div>
            <p className="text-xl font-extrabold leading-none text-[var(--text)]">
              {cls.studentCapacity}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mt-0.5">
              Capacity
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--border)]">
            <button
              onClick={e => {
                e.stopPropagation();
                setOpenDetail(true);
              }}
              className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--blue)] hover:text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
            >
              <LayoutList size={12} />
              View Details
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpenEdit(true);
                }}
                className="flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
              >
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setOpenDelete(true);
                }}
                className="flex cursor-pointer items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
              >
                <Trash2 size={11} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        title={`Class ${cls.classNo} — Section ${cls.section}`}
        description={`${level} · ${academicYear} · ${cls.status}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Students", value: cls.studentCount ?? 0 },
              { label: "Subjects", value: subjectCount },
              { label: "Teachers", value: teacherCount },
              { label: "Capacity", value: cls.studentCapacity },
            ].map(stat => (
              <div
                key={stat.label}
                className="text-center rounded-[var(--radius-sm)] py-3 px-2 bg-[var(--bg-2)] border border-[var(--border)]"
              >
                <p className="text-2xl font-extrabold leading-none text-[var(--blue)]">
                  {stat.value}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-2)] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider mb-1.5">
              Class Teacher
            </p>
            <div className="flex items-center gap-3 p-3 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[var(--text-inverse)] shrink-0"
                style={{ background: "var(--grad-primary)" }}
              >
                {teacherInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] capitalize">
                  {teacherName}
                </p>
                {cls.classTeacher && (
                  <p className="text-xs text-[var(--text-2)] mt-0.5">
                    {cls.classTeacher.designation} ·{" "}
                    {cls.classTeacher.employeeCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {cls.classSubjects && cls.classSubjects.length > 0 && (
            <div>
              <p className="text-xs font-bold text-[var(--text-2)] uppercase tracking-wider mb-1.5">
                Subjects & Teachers ({cls.classSubjects.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cls.classSubjects.map(cs => {
                  const subTeacher = cs.teacher?.user
                    ? `${cs.teacher.user.firstName} ${cs.teacher.user.lastName}`
                    : (cs.teacher?.employeeCode ?? "No teacher assigned");
                  const subTeacherInitials = cs.teacher?.user
                    ? `${cs.teacher.user.firstName?.charAt(0)}${cs.teacher.user.lastName?.charAt(0)}`
                    : "?";
                  return (
                    <div
                      key={cs.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-2)] border border-[var(--border)]"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                          style={{ background: "var(--blue-light)" }}
                        >
                          <BookOpen
                            size={12}
                            style={{ color: "var(--blue)" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)] truncate">
                            {cs.subject.subjectName}
                          </p>
                          <p className="text-xs text-[var(--text-2)] font-medium">
                            {cs.subject.subjectCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-[var(--text-inverse)]"
                          style={{ background: "var(--grad-primary)" }}
                        >
                          {subTeacherInitials}
                        </div>
                        <span className="text-xs text-[var(--text)] capitalize font-medium hidden sm:block">
                          {subTeacher}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Modal>

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
            classNo: String(cls.classNo),
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
            Class {cls.classNo} — Section {cls.section}
          </strong>
          ?
        </p>
      </Modal>
    </>
  );
}
