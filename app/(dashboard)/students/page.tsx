"use client";
import StudentForm from "@/components/forms/studentForm";
import StudentsTable from "@/components/tables/StudentTable";
import Modal from "@/components/ui/Modal";
import { Users } from "lucide-react";
import React, { useState } from "react";

type Tab = {
  label: string;
  count: number;
  key: string;
};

const tabs: Tab[] = [
  { key: "all", label: "All", count: 1284 },
  { key: "active", label: "Active", count: 1190 },
  { key: "pending", label: "Pending", count: 62 },
  { key: "inactive", label: "Inactive", count: 32 },
];
function Page() {
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <div
        className="w-full bg-[var(--surface)] rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-[var(--radius-sm)] bg-[var(--blue-light)] flex items-center justify-center">
            <Users className="w-5 h-5 text-[var(--blue)]" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)] leading-tight">
              Students
            </h1>
            <p className="text-sm text-[var(--text-3)] mt-0.5">
              90 students enrolled · Academic Year
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="btn-primary px-5 text-sm rounded-[var(--radius-sm)] h-10"
          >
            <span className="text-lg leading-none">+</span>
            Admit Student
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-4 py-3 rounded-[var(--radius-md)] gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-[var(--duration)] whitespace-nowrap
                ${
                  active === tab.key
                    ? "bg-[var(--blue)] text-[var(--text-inverse)]"
                    : "bg-[var(--surface)] text-[var(--text-2)] border border-[var(--border)] hover:border-[var(--blue)] hover:text-[var(--blue)]"
                }
              `}
            >
              {tab.label}{" "}
              <span
                className={
                  active === tab.key
                    ? "text-[var(--blue-light)]"
                    : "text-[var(--text-3)]"
                }
              >
                ({tab.count.toLocaleString()})
              </span>
            </button>
          ))}
        </div>

        <div className="relative flex-shrink-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-52 transition-all duration-[var(--duration)]"
          />
        </div>
      </div>

      <div className="mt-3">
        <StudentsTable />
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Admit New Student"
        description="Fill in the details below to register a new student."
      >
        <div className="w-[560px]">
          <StudentForm onclose={() => setIsOpen(false)} />
        </div>
      </Modal>
    </div>
  );
}

export default Page;
