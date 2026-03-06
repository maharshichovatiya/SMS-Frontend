import React from "react";
import { Book, Plus, Pencil, Trash2 } from "lucide-react";
import { SubjectWithClasses } from "@/lib/api/Subject";
import { showToast } from "@/lib/utils/Toast";

interface SubjectCardProps {
  subject: SubjectWithClasses;
  index: number;
  onViewDetails: (subject: SubjectWithClasses) => void;
  onAssignClass: (subjectId: string) => void;
  onAddChapter: (subject: SubjectWithClasses) => void;
  onEditSubject: (subject: SubjectWithClasses) => void;
  onDeleteSubject: (subject: SubjectWithClasses) => void;
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
      className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-6 shadow-[var(--shadow-sm)] animate-fade-up hover:border-[var(--border-focus)] transition-all duration-[var(--duration)] flex flex-col"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex-1">
        <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center mb-4 bg-blue-light text-blue">
          <Book className="w-6 h-6" />
        </div>

        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[17px] font-bold text-[var(--text)]">
                {subject.subjectName}
              </h3>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAssignClass(subject.id);
                }}
                className="px-4 py-2 text-sm font-semibold cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue)] text-[var(--text-inverse)] hover:bg-[var(--blue-dark)] flex items-center gap-2 transition-all duration-[var(--duration)] border border-[var(--blue)] hover:scale-[1.02]"
                title="Assign Class"
              >
                <Plus size={16} strokeWidth={2} />
                Assign Class
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--text-3)]">
                {subject.classSubjects.length} class
                {subject.classSubjects.length !== 1 ? "es" : ""} assigned
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-1">
          {subject.classSubjects.slice(0, 2).map(cls => (
            <div
              key={cls.id}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[var(--text)]">
                  Class {cls.class.className}-{cls.class.section}
                </span>
              </div>
            </div>
          ))}
          {subject.classSubjects.length > 2 && (
            <button
              onClick={e => {
                e.stopPropagation();
                onViewDetails(subject);
              }}
              className="w-full text-center text-xs text-[var(--blue)] hover:text-[var(--blue-dark)] font-medium py-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
            >
              +{subject.classSubjects.length - 2} more classes
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between">
        <button
          onClick={() => onViewDetails(subject)}
          className="text-[var(--blue)] text-sm font-medium hover:text-[var(--blue-dark)] transition-colors cursor-pointer"
        >
          View Details →
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={e => {
              e.stopPropagation();
              // Find first class for this subject to add chapters
              if (subject.classSubjects.length > 0) {
                onAddChapter(subject);
              } else {
                showToast.error(
                  "No classes assigned to this subject. Please assign a class first.",
                );
              }
            }}
            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--green-light)] text-[var(--green)] hover:bg-[var(--green)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--green-light)]"
            title="Add Chapter"
          >
            <Plus size={14} strokeWidth={1.8} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onEditSubject(subject);
            }}
            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--blue-light)] text-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--blue-light)]"
            title="Edit Subject"
          >
            <Pencil size={14} strokeWidth={1.8} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDeleteSubject(subject);
            }}
            className="w-8 h-8 cursor-pointer rounded-[var(--radius-sm)] bg-[var(--rose-light)] text-[var(--rose)] hover:bg-[var(--rose)] hover:text-[var(--text-inverse)] flex items-center justify-center transition-all duration-[var(--duration)] border border-[var(--rose-light)]"
            title="Delete Subject"
          >
            <Trash2 size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}
