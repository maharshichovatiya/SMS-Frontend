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

  const getLucideIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      FileText: <FileText className="w-3 h-3 inline mr-1" />,
      Calendar: <Calendar className="w-3 h-3 inline mr-1" />,
      Megaphone: <Megaphone className="w-3 h-3 inline mr-1" />,
      PartyPopper: <PartyPopper className="w-3 h-3 inline mr-1" />,
    };
    return iconMap[iconName] || <FileText className="w-3 h-3 inline mr-1" />;
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition ${
            selectedFilter === filter.id
              ? "bg-[var(--blue-light)] text-[var(--blue)] border border-[var(--blue)] hover:bg-[var(--blue)] hover:text-[var(--text-inverse)]"
              : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
          }`}
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
