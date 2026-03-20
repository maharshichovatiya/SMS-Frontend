export type ResourceType = "all" | "pdf" | "notes" | "link" | "image";

interface ResourceFilterProps {
  resourceFilter: ResourceType;
  onFilterChange: (filter: ResourceType) => void;
}

const filterOptions: { value: ResourceType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pdf", label: "PDF" },
  { value: "notes", label: "Notes" },
  { value: "link", label: "Link" },
  { value: "image", label: "Image" },
];

export default function ResourceFilter({
  resourceFilter,
  onFilterChange,
}: ResourceFilterProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {filterOptions.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-[var(--duration)] cursor-pointer border ${
            resourceFilter === value
              ? "text-white border-transparent"
              : "bg-[var(--surface)] text-[var(--text-2)] border-[var(--border)] hover:bg-[var(--bg-2)]"
          }`}
          style={
            resourceFilter === value
              ? {
                  background: "var(--grad-primary)",
                  borderColor: "transparent",
                }
              : {}
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
