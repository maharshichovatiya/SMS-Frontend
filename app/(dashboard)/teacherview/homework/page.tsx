"use client";

import React, { useState } from "react";
import { HomeworkCard } from "@/components/homework/HomeWorkCard";
import { SubmissionItem } from "@/components/homework/SubmissionItem";
import { FilterBar } from "@/components/homework/FilterBar";
import { SubmissionModal } from "@/components/homework/SubmissionModal";
import { CreateHomeworkForm } from "@/components/homework/CreateHomeworkForm";
import dummyData from "@/lib/data/homework.json";

interface Homework {
  id: string;
  title: string;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
  submitted: number;
  total: number;
  status: "active" | "completed" | "overdue";
  color: "blue" | "green" | "amber" | "rose" | "indigo";
}

interface Submission {
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: "submitted" | "graded" | "late" | "pending";
  grade?: string;
  feedback?: string;
}

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export default function HomeworkPage() {
  const [selectedHomework, setSelectedHomework] = useState<string | null>(null);
  const [submissionFilter, setSubmissionFilter] = useState("all");
  const [isTeacher] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const homeworkList: Homework[] = dummyData.homeworks.map(hw => ({
    ...hw,
    status: hw.status as "active" | "completed" | "overdue",
    color: hw.color as "blue" | "green" | "amber" | "rose" | "indigo",
  }));
  const allSubmissions: Submission[] = dummyData.submissions.map(s => ({
    ...s,
    status: s.status as "submitted" | "graded" | "late" | "pending",
  }));
  const filterOpts: FilterOption[] = dummyData.filterOptions;

  const filterCounts = {
    all: allSubmissions.length,
    submitted: allSubmissions.filter(s => s.status === "submitted").length,
    graded: allSubmissions.filter(s => s.status === "graded").length,
    late: allSubmissions.filter(s => s.status === "late").length,
    pending: allSubmissions.filter(s => s.status === "pending").length,
  };

  const filtersWithCounts = filterOpts.map(f => ({
    label: f.label,
    value: f.value,
    count: filterCounts[f.value as keyof typeof filterCounts],
  }));

  const filteredSubmissions =
    submissionFilter === "all"
      ? allSubmissions
      : allSubmissions.filter(s => s.status === submissionFilter);

  const selectedHwData = homeworkList.find(h => h.id === selectedHomework);

  return (
    <div className="font-[var(--font-sans)] min-h-screen relative">
      <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp">
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(90deg, #3d6cf4, #6c47f5)`,
          }}
        />
        <div className="px-4 sm:px-7 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold text-[#9aa5c4] uppercase tracking-[0.5px] mb-1.5 font-[var(--font-sans)]">
                Academic Management
              </div>
              <div className="text-xl sm:text-2xl font-extrabold tracking-[-0.5px] text-[#111827] font-[var(--font-sans)] leading-[1.2]">
                Homework Management
              </div>
              <div className="text-[12px] sm:text-[13.5px] text-[#5c6a8a] mt-1 font-[var(--font-sans)]">
                Track assignments and manage student submissions
              </div>
            </div>
            {isTeacher && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full sm:w-auto px-[22px] py-2.5 rounded-[11px] border-none bg-[#3d6cf4] text-[13.5px] font-semibold text-white cursor-pointer font-[var(--font-sans)] shadow-[0_4px_14px_rgba(61,108,244,0.3)] transition-all duration-180 flex items-center justify-center gap-1.5"
              >
                Create Homework
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl mb-[18px] shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden animate-fadeUp"
        style={{ animationDelay: "0.05s" }}
      >
        <div className="px-[22px] py-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search homework..."
              className="w-full px-4 py-3 border-[1.5px] border-[#dde3f5] rounded-lg font-[var(--font-sans)] text-[13.5px] text-[#111827] outline-none transition-all duration-200 bg-[#fafbff] cursor-text focus:border-[#3d6cf4] focus:shadow-[0_0_0_3px_rgba(61,108,244,0.1)]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px] mb-[18px]">
        {homeworkList.map((hw, idx) => (
          <div
            key={hw.id}
            className="animate-fadeUp"
            style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
          >
            <HomeworkCard
              {...hw}
              onView={() => {
                setSelectedHomework(hw.id);
                setSubmissionFilter("all");
              }}
            />
          </div>
        ))}
      </div>

      {selectedHomework && selectedHwData && (
        <SubmissionModal
          title={selectedHwData.title}
          subject={selectedHwData.subject}
          class={selectedHwData.class}
          teacher={selectedHwData.teacher}
          dueDate={selectedHwData.dueDate}
          submitted={selectedHwData.submitted}
          total={selectedHwData.total}
          isOpen={true}
          onClose={() => {
            setSelectedHomework(null);
            setSubmissionFilter("all");
          }}
        >
          <div className="sticky top-0 bg-[var(--bg)] z-10 py-4 border-b border-[var(--border)]">
            <FilterBar
              activeFilter={submissionFilter}
              filters={filtersWithCounts}
              onFilterChange={setSubmissionFilter}
            />
          </div>

          <div className="p-6">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission, idx) => (
                <SubmissionItem
                  key={idx}
                  {...submission}
                  isTeacher={isTeacher}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 font-medium">
                  No submissions to display
                </p>
              </div>
            )}
          </div>
        </SubmissionModal>
      )}

      {showCreateForm && (
        <CreateHomeworkForm
          onClose={() => setShowCreateForm(false)}
          onSubmit={() => {
            setShowCreateForm(false);
          }}
        />
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] animate-fadeUp"
        style={{ animationDelay: "0.3s" }}
      >
        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
          <div className="px-[22px] py-4 border-b border-[#dde3f5] bg-[#fafbff]">
            <div className="text-[15px] font-bold text-[#111827] font-[var(--font-sans)]">
              Average Submission Rate
            </div>
          </div>
          <div className="px-[22px] py-5">
            <div className="text-2xl sm:text-3xl font-bold text-[#3d6cf4] font-[var(--font-sans)]">
              84%
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#9aa5c4] mt-1 font-[var(--font-sans)]">
              Of all assignments
            </div>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl shadow-[0_1px_4px_rgba(61,108,244,0.06),0_4px_14px_rgba(61,108,244,0.07)] overflow-hidden">
          <div className="px-[22px] py-4 border-b border-[#dde3f5] bg-[#fafbff]">
            <div className="text-[15px] font-bold text-[#111827] font-[var(--font-sans)]">
              Completed Assignments
            </div>
          </div>
          <div className="px-[22px] py-5">
            <div className="text-2xl sm:text-3xl font-bold text-[#12a47e] font-[var(--font-sans)]">
              1 / 4
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#9aa5c4] mt-1 font-[var(--font-sans)]">
              This week
            </div>
          </div>
        </div>

        <div className="bg-white border-[1.5px] border-[#dde3f5] rounded-2xl  overflow-hidden sm:col-span-2 lg:col-span-1">
          <div className="px-[22px] py-4 border-b border-[#dde3f5] bg-[#fafbff]">
            <div className="text-[15px] font-bold text-[#111827] font-[var(--font-sans)]">
              Pending Review
            </div>
          </div>
          <div className="px-[22px] py-5">
            <div className="text-2xl sm:text-3xl font-bold text-[#e08c17] font-[var(--font-sans)]">
              23
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#9aa5c4] mt-1 font-[var(--font-sans)]">
              Submissions to grade
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
