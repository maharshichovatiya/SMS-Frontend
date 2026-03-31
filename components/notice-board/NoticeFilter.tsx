import { Megaphone, FileText, Calendar, PartyPopper } from "lucide-react";
import { NoticeFilterType } from "@/lib/types/Notice";

interface NoticeFilterProps {
  selectedFilter: NoticeFilterType;
  onFilterChange: (filter: NoticeFilterType) => void;
}

export default function NoticeFilter({
  selectedFilter,
  onFilterChange,
}: NoticeFilterProps) {
  const filters: { id: NoticeFilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "general", label: "General" },
    { id: "exam", label: "Exam" },
    { id: "holiday", label: "Holiday" },
    { id: "event", label: "Event" },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
            selectedFilter === filter.id
              ? "text-white border-transparent"
              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
          }`}
          style={
            selectedFilter === filter.id
              ? { background: "var(--grad-primary)" }
              : {}
          }
        >
          {filter.id === "all" && "All"}
          {filter.id === "general" && (
            <>
              <Megaphone className="w-3 h-3 inline mr-1" />
              General
            </>
          )}
          {filter.id === "exam" && (
            <>
              <FileText className="w-3 h-3 inline mr-1" />
              Exam
            </>
          )}
          {filter.id === "holiday" && (
            <>
              <Calendar className="w-3 h-3 inline mr-1" />
              Holiday
            </>
          )}
          {filter.id === "event" && (
            <>
              <PartyPopper className="w-3 h-3 inline mr-1" />
              Event
            </>
          )}
        </button>
      ))}
    </div>
  );
}
