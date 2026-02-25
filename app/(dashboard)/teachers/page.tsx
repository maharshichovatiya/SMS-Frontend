"use client";
import TeacherForm from "@/components/forms/TeacherForm";
import TeacherCard, { Teacher } from "@/components/TeachersCard";
import Modal from "@/components/ui/Modal";
import { Plus, Users } from "lucide-react";
import { useState } from "react";

export default function TeachersPage() {
  const [open, setOpen] = useState(false);
  const teachers: Teacher[] = [
    {
      id: 1,
      email: "sunita.mishra@example.com",
      firstName: "Sunita",
      lastName: "Mishra",
      phone: "9876543210",
      gender: "Female",
      dob: "1988-04-12",
      schoolId: "SCH001",
      employeeCode: "EMP101",
      staffCategory: "Teaching",
      department: "Mathematics",
      designation: "Senior Mathematics Teacher",
      dateOfJoining: "2018-06-01",
      salaryPackage: 52000,
      highestQualification: "M.Sc Mathematics, B.Ed",
      experienceYears: 12,
      profilePhoto: "",
    },
    {
      id: 2,
      email: "vivek.pandey@example.com",
      firstName: "Vivek",
      lastName: "Pandey",
      phone: "9123456780",
      gender: "Male",
      dob: "1992-08-20",
      schoolId: "SCH001",
      employeeCode: "EMP102",
      staffCategory: "Teaching",
      department: "Science",
      designation: "Physics Teacher",
      dateOfJoining: "2020-03-15",
      salaryPackage: 46000,
      highestQualification: "M.Sc Physics, B.Ed",
      experienceYears: 8,
      profilePhoto: "",
    },
    {
      id: 3,
      email: "rekha.tiwari@example.com",
      firstName: "Rekha",
      lastName: "Tiwari",
      phone: "9988776655",
      gender: "Female",
      dob: "1985-11-05",
      schoolId: "SCH001",
      employeeCode: "EMP103",
      staffCategory: "Teaching",
      department: "Language",
      designation: "English Teacher",
      dateOfJoining: "2015-01-10",
      salaryPackage: 58000,
      highestQualification: "M.A English, B.Ed",
      experienceYears: 15,
      profilePhoto: "",
    },
  ];

  return (
    <div className="min-h-screen p-8 ">
      <div className="w-full bg-[var(--surface)] rounded-[var(--radius-lg)] px-8 py-6 flex items-center justify-between border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[var(--radius-md)] bg-[var(--green-light)] flex items-center justify-center">
            <Users className="w-6 h-6 text-[var(--green)]" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text)]">
              Teachers
            </h1>
            <p className="text-sm text-[var(--text-2)] mt-1">
              {teachers.length} staff members across all departments
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {teachers.map(teacher => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Add New Teacher"
          description="Fill in the details below to register a new staff member."
        >
          <TeacherForm onCancel={() => setOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
