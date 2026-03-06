import React from "react";
import { Book, Plus, Pencil, Trash2 } from "lucide-react";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";
import { showToast } from "@/lib/utils/Toast";

interface SubjectCardProps {
  subject: SubjectWithClassSubjects;
  index: number;
  onViewDetails: (subject: SubjectWithClassSubjects) => void;
  onAssignClass: (subjectId: string) => void;
  onAddChapter: (subject: SubjectWithClassSubjects) => void;
  onEditSubject: (subject: SubjectWithClassSubjects) => void;
  onDeleteSubject: (subject: SubjectWithClassSubjects) => void;
}

export function SubjectCard({
  subject,
  index,
  onViewDetails,
  onAssignClass,
  onAddChapter,
  onEditSubject,
  onDeleteSubject,
}: SubjectCardProps) {
  return (
    <div
      key={subject.id}
      className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-4 sm:p-6 shadow-[var(--shadow-sm)] animate-fade-up hover:border-[var(--border-focus)] transition-all duration-[var(--duration)] flex flex-col"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex-1">
        <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-[12px] sm:rounded-[14px] flex items-center justify-center mb-3 sm:mb-4 bg-blue-light text-blue">
          <Book className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
              <h3 className="text-[15px] sm:text-[17px] font-bold text-[var(--text)]">
                {subject.subjectName}
              </h3>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAssignClass(subject.id);
                }}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue)] text-[var(--text-inverse)] hover:bg-[var(--blue-dark)] flex items-center gap-1.5 sm:gap-2 transition-all duration-[var(--duration)] border border-[var(--blue)] hover:scale-[1.02]"
                title="Assign Class"
              >
                <Plus size={14} className="sm:size-4" strokeWidth={2} />
                <span className="hidden sm:inline">Assign Class</span>
                <span className="sm:hidden">Assign</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-3)]">
                {subject.classSubjects?.length || 0} class
                {(subject.classSubjects?.length || 0) !== 1 ? "es" : ""}{" "}
                assigned
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-1">
          {subject.classSubjects?.slice(0, 2).map(cls => (
            <div
              key={cls.id}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-2 sm:p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text)]">
                  Class {cls.class.className}-{cls.class.section}
                </span>
              </div>
            </div>
          ))}
          {(subject.classSubjects?.length || 0) > 2 && (
            <button
              onClick={e => {
                e.stopPropagation();
                onViewDetails(subject);
              }}
              className="w-full text-center text-xs text-[var(--blue)] hover:text-[var(--blue-dark)] font-medium py-1.5 sm:py-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
            >
              +{(subject.classSubjects?.length || 0) - 2} more classes
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button
          onClick={() => onViewDetails(subject)}
          className="text-[var(--blue)] text-xs sm:text-sm font-medium hover:text-[var(--blue-dark)] transition-colors cursor-pointer order-2 sm:order-1"
        >
          View Details →
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
          <button
            onClick={e => {
              e.stopPropagation();
              // Find first class for this subject to add chapters
              if (subject.classSubjects && subject.classSubjects.length > 0) {
                onAddChapter(subject);
              } else {
                showToast.error(
                  "No classes assigned to this subject. Please assign a class first.",
                );
              }
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--green-light)] text-[var(--green)] hover:bg-[var(--green)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--green-light)]"
            title="Add Chapter"
          >
            <Plus size={12} className="sm:size-3.5" strokeWidth={1.8} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onEditSubject(subject);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
            title="Edit Subject"
          >
            <Pencil size={12} className="sm:size-3.5" strokeWidth={1.8} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDeleteSubject(subject);
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)]"
            title="Delete Subject"
          >
            <Trash2 size={12} className="sm:size-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
