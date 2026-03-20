import { Chapter } from "@/lib/types/Resources";
import { BookMarked, Layers } from "lucide-react";

interface ChapterHeaderProps {
  chapter: Chapter;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ChapterHeader({
  chapter,
  isSelected,
  onClick,
}: ChapterHeaderProps) {
  return (
    <div
      className={`group bg-[var(--surface)] border-b border-[var(--border)] cursor-pointer transition-all duration-[var(--duration)] ${
        isSelected ? "bg-[var(--blue-light)]" : "hover:bg-[var(--surface-2)]"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-[var(--duration)] ${
              isSelected
                ? "bg-[var(--blue)] text-white shadow-md shadow-[var(--shadow-blue)]"
                : "bg-[var(--bg-2)] text-[var(--text-2)] group-hover:bg-[var(--blue-light)] group-hover:text-[var(--blue)]"
            }`}
          >
            <BookMarked
              className={`w-6 h-6 ${isSelected ? "text-white" : ""}`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-[var(--text-3)] uppercase tracking-wider">
                Chapter {chapter.chapterNo}
              </span>
              {isSelected && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[var(--blue)] text-white rounded-full shadow-sm">
                  Active
                </span>
              )}
            </div>
            <h3
              className={`text-xl font-bold transition-colors ${
                isSelected ? "text-[var(--blue-dark)]" : "text-[var(--text)]"
              }`}
            >
              {chapter.chapterName}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${
              isSelected
                ? "bg-white text-[var(--blue)] shadow-sm"
                : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)]"
            }`}
          >
            <Layers className="w-4 h-4" />
            {chapter.resources.length}
            <span className="hidden sm:inline">Resources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
