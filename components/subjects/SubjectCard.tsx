import React from "react";
import { Book, Plus, Pencil, Trash2, Target, Award } from "lucide-react";
import { SubjectWithClassSubjects } from "@/lib/api/Subject";

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
      className="bg-[var(--surface)] border-[1.5px] border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow-sm)] animate-fade-up flex flex-col min-h-[280px]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Card Body */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Icon + Title Row */}
        <div className="flex items-start gap-3 mb-2">
          <div className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center bg-blue-light text-blue">
            <Book className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-[15px] font-bold text-[var(--text)] leading-tight truncate"
              title={subject.subjectName}
            >
              {subject.subjectName}
            </h3>
            <p
              className="text-[12px] text-[var(--text-2)] font-medium mt-0.5 truncate"
              title={subject.subjectCode}
            >
              Code: {subject.subjectCode}
            </p>
          </div>
        </div>

        {/* Marks Information - Full width outside icon container */}
        <div className="grid grid-cols-3 gap-1.5 w-full">
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] w-full">
            <div className="flex items-center gap-0.5 text-[var(--blue)] leading-none">
              <Target size={14} strokeWidth={2.5} />
              <span className="text-lg font-extrabold">{subject.maxMarks}</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Max Marks
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] w-full">
            <div className="flex items-center gap-0.5 text-[var(--amber)] leading-none">
              <Award size={14} strokeWidth={2.5} />
              <span className="text-lg font-extrabold">
                {subject.passingMarks}
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Min Marks
            </span>
          </div>
          <div className="flex flex-col items-center py-2.5 rounded-[var(--radius-sm)] bg-[var(--surface-2)] w-full">
            <div className="flex items-center gap-0.5 text-[var(--green)] leading-none">
              <Award size={14} strokeWidth={2.5} />
              <span className="text-lg font-extrabold">
                {Math.round(subject.passingMarks)}
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-3)] mt-1">
              Pass Marks
            </span>
          </div>
        </div>

        {/* Classes Count + List */}
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-[var(--text-3)]">
            {subject.classSubjects?.length || 0} class
            {(subject.classSubjects?.length || 0) !== 1 ? "es" : ""} assigned
          </span>

          {subject.classSubjects?.slice(0, 2).map(cls => (
            <div
              key={cls.id}
              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[var(--radius-sm)] px-3 py-2"
            >
              <span className="text-xs font-semibold text-[var(--text)]">
                Class {cls.class.className}-{cls.class.section}
              </span>
            </div>
          ))}

          {(subject.classSubjects?.length || 0) > 2 && (
            <button
              onClick={e => {
                e.stopPropagation();
                onViewDetails(subject);
              }}
              className="w-full text-center text-xs text-[var(--blue)] hover:text-[var(--blue-dark)] font-medium py-2 bg-[var(--surface-2)] rounded-[var(--radius-sm)] border border-[var(--border)] hover:bg-[var(--surface-3)] transition-colors"
            >
              +{(subject.classSubjects?.length || 0) - 2} more classes
            </button>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-col gap-3">
        <button
          onClick={e => {
            e.stopPropagation();
            onAssignClass(subject.id);
          }}
          className="btn-primary cursor-pointer w-full px-2 text-sm font-medium rounded-[var(--radius-sm)] flex items-center justify-center transition-all duration-[var(--duration)] border hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={10} strokeWidth={2} />
          <span>Assign Class</span>
        </button>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => onViewDetails(subject)}
            className="text-[var(--blue)] text-sm font-medium hover:text-[var(--blue-dark)] transition-colors cursor-pointer shrink-0"
          >
            View Details →
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onAddChapter(subject);
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
    </div>
  );
}
