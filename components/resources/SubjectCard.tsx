import {
  Calculator,
  Beaker,
  PenTool,
  Code,
  BarChart3,
  BookOpen,
  File,
  User,
} from "lucide-react";
import { Subject } from "@/lib/types/Resources";

interface SubjectCardProps {
  subject: Subject;
  onClick: (subject: Subject) => void;
}

const getIconComponent = (iconName: string): React.ReactNode => {
  const iconMap: { [key: string]: React.ReactNode } = {
    calc: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-blue-500 rounded-lg">
        <Calculator className="w-5 h-5" />
      </div>
    ),
    flask: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-green-500 rounded-lg">
        <Beaker className="w-5 h-5" />
      </div>
    ),
    lang: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-indigo-500 rounded-lg">
        <PenTool className="w-5 h-5" />
      </div>
    ),
    code: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-cyan-500 rounded-lg">
        <Code className="w-5 h-5" />
      </div>
    ),
    chart: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-amber-500 rounded-lg">
        <BarChart3 className="w-5 h-5" />
      </div>
    ),
    history: (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-rose-500 rounded-lg">
        <BookOpen className="w-5 h-5" />
      </div>
    ),
  };
  return (
    iconMap[iconName] || (
      <div className="w-8 h-8 flex items-center justify-center text-white bg-gray-500 rounded-lg">
        <File className="w-5 h-5" />
      </div>
    )
  );
};

const getTotalResources = (subject: Subject) => {
  return subject.chapters.reduce(
    (total, chapter) => total + chapter.resources.length,
    0,
  );
};

export default function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <div
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] p-4 hover:border-[var(--blue)] transition-all duration-150 cursor-pointer hover:-translate-y-0.5"
      onClick={() => onClick(subject)}
      style={{ boxShadow: "var(--shadow-sm)" }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-shrink-0">{getIconComponent("calc")}</div>
        <div className="px-2 py-1 bg-[var(--bg)] rounded text-xs font-semibold text-[var(--text)]">
          {subject.subjectName}
        </div>
      </div>
      <h3 className="font-bold text-[var(--text)] mb-3">
        {subject.subjectName}
      </h3>
      <div className="border-b border-dashed border-[var(--border)] pb-2 mb-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-2)]">
          <User className="w-4 h-4" />
          <span>Teacher</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-lg font-bold">
        <div className="text-center">
          <div className="text-[var(--text)]">{subject.chapters.length}</div>
          <div className="text-xs text-[var(--text-3)] font-normal">
            Chapters
          </div>
        </div>
        <div className="text-center">
          <div className="text-[var(--text)]">{getTotalResources(subject)}</div>
          <div className="text-xs text-[var(--text-3)] font-normal">
            Resources
          </div>
        </div>
      </div>
    </div>
  );
}
