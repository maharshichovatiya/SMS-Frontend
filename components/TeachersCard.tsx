"use client";

import { Pencil, Trash2, Mail, Phone, Calendar } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Modal from "./ui/Modal";
import TeacherForm from "./forms/TeacherForm";

export interface Teacher {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  schoolId: string;
  employeeCode: string;
  staffCategory: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  salaryPackage: number;
  highestQualification: string;
  experienceYears: number;
  profilePhoto?: string;
}

interface Props {
  teacher: Teacher;
}

export default function TeacherCard({ teacher }: Props) {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const initials = teacher.firstName.charAt(0) + teacher.lastName.charAt(0);

  return (
    <div className="mt-5 bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] p-6 hover:shadow-[var(--shadow)] transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)]">
            {fullName}
          </h2>
          <p className="text-sm text-[var(--text-2)]">{teacher.designation}</p>
        </div>
        <span className="text-xs bg-[var(--blue-light)] text-[var(--blue)] px-3 py-1 rounded-full font-medium">
          {teacher.staffCategory}
        </span>
      </div>

      <div className="flex items-start gap-4 mt-5">
        {teacher.profilePhoto ? (
          <Image
            src={teacher.profilePhoto}
            alt={fullName}
            width={64}
            height={64}
            className="w-16 h-16 rounded-[var(--radius-md)] object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-[var(--radius-md)] text-[var(--text-inverse)] flex items-center justify-center font-semibold text-lg"
            style={{ background: "var(--grad-primary)" }}
          >
            {initials}
          </div>
        )}

        <div className="text-sm text-[var(--text-2)] space-y-1">
          <p className="font-medium text-[var(--text)]">{teacher.department}</p>
          <p>{teacher.highestQualification}</p>
          <p>{teacher.experienceYears} years experience</p>
          <p className="flex items-center gap-1">
            <Mail size={14} /> {teacher.email}
          </p>
          <p className="flex items-center gap-1">
            <Phone size={14} /> {teacher.phone}
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--border)] my-5" />

      <div className="text-sm text-[var(--text-2)] space-y-2">
        <p className="flex items-center gap-2">
          <Calendar size={14} />
          DOB: {teacher.dob}
        </p>
        <p>Joined: {teacher.dateOfJoining}</p>
        <p>Employee Code: {teacher.employeeCode}</p>
        <p>Salary: ₹{teacher.salaryPackage.toLocaleString()}/month</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setOpenEdit(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[var(--radius-sm)] border border-[var(--blue)] text-[var(--blue)] hover:bg-[var(--blue-light)] transition"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => setOpenDelete(true)}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[var(--radius-sm)] border border-[var(--rose)] text-[var(--rose)] hover:bg-[var(--rose-light)] transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      {/* update teacher  */}
      <Modal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Edit Teacher"
        description="Update the staff member's details."
      >
        <TeacherForm
          mode="edit"
          onCancel={() => setOpenEdit(false)}
          defaultValues={teacher}
        />
      </Modal>

      {/* delete teacher */}
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
            <button className="flex-1 py-2 rounded-[var(--radius-sm)] bg-[var(--rose)] text-[var(--text-inverse)] hover:bg-[var(--rose-dark)] transition font-semibold">
              Delete
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
