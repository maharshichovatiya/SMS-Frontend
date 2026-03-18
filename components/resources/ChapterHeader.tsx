import { Chapter } from "@/lib/types/Resources";

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
    <div>
      <div
        className={`bg-[var(--surface)] border-b border-[var(--border)] cursor-pointer transition-colors duration-[var(--duration)] ${
          isSelected ? "bg-[var(--surface-2)]" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex flex-col justify-between m-4">
          <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            {chapter.chapterName}
            {isSelected && (
              <span className="ml-2 px-2 py-1 text-xs bg-[var(--blue)] text-white rounded-full">
                Selected
              </span>
            )}
          </h3>
          <div className="text-sm text-[var(--text-2)]">
            {chapter.resources.length} Resources
          </div>
        </div>
      </div>
    </div>
  );
}
