"use client";
import { Building2 } from "lucide-react";
import React, { useState } from "react";

const GRADE_TABS = [
  { key: "all", label: "All Grades" },
  { key: "junior", label: "Junior (1–5)" },
  { key: "middle", label: "Middle (6–8)" },
  { key: "secondary", label: "Secondary (9–10)" },
  { key: "senior", label: "Senior (11–12)" },
];

import ClassCard, { ClassItem } from "@/components/classesCard";

const SAMPLE_CLASSES: ClassItem[] = [
  {
    id: "1",
    class_name: "10-A",
    section: "A",
    class_teacher_id: "df69bae9-3782-4e09-be65-ab8f2160e729",
    student_capacity: 40,
    status: "active",
    teacher: "Sunita Mishra",
    subjects: [
      { label: "Math", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
      {
        label: "Science",
        color: "bg-[var(--green-light)] text-[var(--green)]",
      },
      {
        label: "English",
        color: "bg-[var(--indigo-light)] text-[var(--indigo)]",
      },
    ],
    students: 38,
    subjects_count: 8,
    teachers: 6,
  },
  {
    id: "2",
    class_name: "9-B",
    section: "B",
    class_teacher_id: "a1b2c3d4-1111-2222-3333-444455556666",
    student_capacity: 45,
    status: "active",
    teacher: "Vivek Pandey",
    subjects: [
      {
        label: "Science",
        color: "bg-[var(--green-light)] text-[var(--green)]",
      },
      { label: "Math", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
      { label: "CS", color: "bg-[var(--cyan-light)] text-[var(--cyan)]" },
    ],
    students: 42,
    subjects_count: 8,
    teachers: 6,
  },
  {
    id: "3",
    class_name: "11-C",
    section: "C",
    class_teacher_id: "b2c3d4e5-2222-3333-4444-555566667777",
    student_capacity: 38,
    status: "active",
    teacher: "Rekha Tiwari",
    subjects: [
      {
        label: "English",
        color: "bg-[var(--indigo-light)] text-[var(--indigo)]",
      },
      {
        label: "Accounts",
        color: "bg-[var(--amber-light)] text-[var(--amber)]",
      },
      { label: "CS", color: "bg-[var(--cyan-light)] text-[var(--cyan)]" },
    ],
    students: 35,
    subjects_count: 7,
    teachers: 5,
  },
  {
    id: "4",
    class_name: "7-A",
    section: "A",
    class_teacher_id: "c3d4e5f6-3333-4444-5555-666677778888",
    student_capacity: 35,
    status: "active",
    teacher: "Anjali Sharma",
    subjects: [
      { label: "Math", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
      {
        label: "English",
        color: "bg-[var(--indigo-light)] text-[var(--indigo)]",
      },
      { label: "Hindi", color: "bg-[var(--rose-light)] text-[var(--rose)]" },
    ],
    students: 32,
    subjects_count: 6,
    teachers: 5,
  },
  {
    id: "5",
    class_name: "8-B",
    section: "B",
    class_teacher_id: "d4e5f6a7-4444-5555-6666-777788889999",
    student_capacity: 40,
    status: "active",
    teacher: "Ramesh Gupta",
    subjects: [
      {
        label: "Science",
        color: "bg-[var(--green-light)] text-[var(--green)]",
      },
      { label: "Math", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
      {
        label: "English",
        color: "bg-[var(--indigo-light)] text-[var(--indigo)]",
      },
    ],
    students: 39,
    subjects_count: 7,
    teachers: 5,
  },
  {
    id: "6",
    class_name: "5-A",
    section: "A",
    class_teacher_id: "e5f6a7b8-5555-6666-7777-888899990000",
    student_capacity: 30,
    status: "active",
    teacher: "Priya Mehta",
    subjects: [
      { label: "Math", color: "bg-[var(--blue-light)] text-[var(--blue)]" },
      { label: "EVS", color: "bg-[var(--green-light)] text-[var(--green)]" },
      {
        label: "English",
        color: "bg-[var(--indigo-light)] text-[var(--indigo)]",
      },
    ],
    students: 28,
    subjects_count: 5,
    teachers: 4,
  },
];

function Page() {
  const [active, setActive] = useState("all");

  const handleClick = (key: string) => {
    setActive(key);
  };

  return (
    <div>
      <div
        className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--cyan-light)] flex items-center justify-center">
            <Building2
              className="w-5 h-5 text-[var(--cyan)]"
              strokeWidth={1.8}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
              Classes
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">
              40 sections · Academic Year 2026
            </p>
          </div>
        </div>

        <button className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10">
          <span className="text-lg leading-none">+</span>
          Create Class
        </button>
      </div>

      <div className="flex mt-3 items-center gap-2 flex-wrap">
        {GRADE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-[var(--duration)] whitespace-nowrap
            ${
              active === tab.key
                ? "bg-[var(--blue)] text-[var(--text-inverse)]"
                : "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
            }
          `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid mt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SAMPLE_CLASSES.map(cls => (
          <ClassCard key={cls.id} cls={cls} />
        ))}
      </div>
    </div>
  );
}

export default Page;
