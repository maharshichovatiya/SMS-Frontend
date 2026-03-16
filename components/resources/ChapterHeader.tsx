import { Chapter } from "@/lib/types/Resources";

interface ChapterHeaderProps {
  chapter: Chapter;
}

export default function ChapterHeader({ chapter }: ChapterHeaderProps) {
  return (
    <div>
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex flex-col justify-between m-4">
          <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
            {chapter.name}
          </h3>
          <div className="text-sm text-[var(--text-2)]">
            {chapter.resources.length} Resources
          </div>
        </div>
      </div>
    </div>
  );
}
