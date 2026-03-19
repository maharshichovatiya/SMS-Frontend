import { ArrowLeft, BookOpen } from "lucide-react";
import { Class, Subject } from "@/lib/types/Resources";

type ViewType = "classes" | "subjects" | "chapters";

interface BreadcrumbProps {
  currentView: ViewType;
  selectedClass?: Class | null;
  selectedSubject?: Subject | null;
  onBackToClasses: () => void;
  onBackToSubjects: () => void;
}

export default function Breadcrumb({
  currentView,
  selectedClass,
  selectedSubject,
  onBackToClasses,
  onBackToSubjects,
}: BreadcrumbProps) {
  if (currentView === "classes") {
    return (
      <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
        <span className="font-bold text-[var(--text)] flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          All Classes
        </span>
      </div>
    );
  }

  if (currentView === "subjects") {
    return (
      <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
        <button
          onClick={onBackToClasses}
          className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          All Classes
        </button>
        <span className="text-xs text-[var(--text-3)] select-none">/</span>
        <span className="font-bold text-[var(--text)]">
          {selectedClass?.code} - {selectedClass?.name}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5 flex items-center gap-1.5 mb-4.5 text-sm font-medium text-[var(--text-2)] flex-wrap">
      <button
        onClick={onBackToClasses}
        className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        All Classes
      </button>
      <span className="text-xs text-[var(--text-3)] select-none">/</span>
      <button
        onClick={onBackToSubjects}
        className="font-semibold text-[var(--blue)] hover:text-[var(--blue-d)] hover:underline transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {selectedClass?.code} - {selectedClass?.name}
      </button>
      <span className="text-xs text-[var(--text-3)] select-none">/</span>
      <span className="font-bold text-[var(--text)]">
        {selectedSubject?.name}
      </span>
    </div>
  );
}
