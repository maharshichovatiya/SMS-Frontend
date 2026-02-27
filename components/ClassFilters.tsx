import { Search } from "lucide-react";

const GRADE_TABS = [
  { key: "all", label: "All" },
  { key: "junior", label: "Junior (1–5)" },
  { key: "middle", label: "Middle (6–8)" },
  { key: "secondary", label: "Secondary (9–10)" },
  // { key: "senior", label: "Senior (11–12)" },
];

interface Props {
  active: string;
  onTabChange: (key: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ClassFilters({
  active,
  onTabChange,
  search,
  onSearchChange,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        {GRADE_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition whitespace-nowrap ${
              active === tab.key
                ? "text-white border-transparent"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
            }`}
            style={
              active === tab.key
                ? {
                    background: "var(--grad-primary)",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "var(--text-3)" }}
        />
        <input
          type="text"
          placeholder="Search classes..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-9 pr-4 py-2 text-sm border border-[var(--border)] rounded-full bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-muted)] focus:border-[var(--border-focus)] w-64 transition-all duration-[var(--duration)]"
        />
      </div>
    </div>
  );
}
