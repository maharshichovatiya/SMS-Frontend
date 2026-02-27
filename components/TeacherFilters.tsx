import { Search } from "lucide-react";

const DEPARTMENTS = [
  "all",
  "academic",
  "administration",
  "sports",
  "laboratory",
];

interface TeacherFiltersProps {
  search: string;
  department: string;
  onSearchChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
}

export default function TeacherFilters({
  search,
  department,
  onSearchChange,
  onDepartmentChange,
}: TeacherFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-2 flex-wrap">
        {DEPARTMENTS.map(d => (
          <button
            key={d}
            onClick={() => onDepartmentChange(d)}
            className={`px-4 cursor-pointer py-1.5 rounded-full text-sm font-medium border transition capitalize ${
              department === d
                ? "text-white border-transparent"
                : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-2)]"
            }`}
            style={
              department === d
                ? {
                    background: "var(--grad-primary)",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
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
          placeholder="Search teachers..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="input-base pl-9 w-64"
        />
      </div>
    </div>
  );
}
